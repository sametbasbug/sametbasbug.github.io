from __future__ import annotations

from news_pipeline.models.queue import QueueItem


PLACEHOLDER_BODY_MARKERS = {
    "Bu taslak, hızlı yayın hazırlığı için oluşturuldu.",
    "Son yayına alınmadan önce başlık tonu, bağlam ve gerekiyorsa ikinci kaynak kontrolü yapılmalıdır.",
    "Mevcut metin, yayın öncesi hazırlık katmanıdır; nihai sürüm değildir.",
}


def _clean_facts(item: QueueItem) -> list[str]:
    facts = [fact.strip() for fact in item.draft_facts if fact and fact.strip()]
    if not facts:
        return ["İlk çerçeve ve temel ayrıntılar mevcut kaynaklardan derlendi."]
    return facts[:4]


def _topic_context(item: QueueItem) -> str:
    text = f"{item.draft_title} {item.draft_description} {' '.join(item.draft_facts)}".lower()
    if any(term in text for term in ["openai", "anthropic", "google", "adobe", "chrome", "ai", "yapay zeka", "veri merkezi"]):
        return (
            "Bu başlık, teknoloji ve yapay zeka şirketleri arasındaki rekabette yatırım, ürün yönü veya altyapı kapasitesi tarafında yeni bir eşik oluştuğuna işaret ediyor."
        )
    if any(term in text for term in ["seçim", "trump", "iran", "ukrayna", "rusya", "britain", "hükümet"]):
        return (
            "Bu gelişme, siyasi denge veya diplomatik temaslar açısından yeni bir pozisyon değişikliğine ya da yeni bir gerilim başlığına işaret edebilir."
        )
    if any(term in text for term in ["açık", "güvenlik", "hack", "zararlı", "backdoor", "siber"]):
        return (
            "Haber, kullanıcılar ve kurumlar açısından doğrudan güvenlik etkisi doğurabilecek bir riskin ya da savunma adımının altını çiziyor."
        )
    return (
        "Gelişme, ilgili alanda şirketlerin, kurumların veya piyasanın hangi başlıklarda pozisyon aldığını göstermesi açısından dikkat çekiyor."
    )


def build_body(item: QueueItem) -> str:
    lead = item.draft_description.strip()
    source_name = item.draft_sources[0].name if item.draft_sources else "ilk kaynak"
    source_url = item.draft_sources[0].url if item.draft_sources else "https://example.com"

    facts = _clean_facts(item)

    opening = f"{lead}"

    nutgraf = (
        f"{source_name} kaynaklı ilk çerçeveye göre bu gelişme, {facts[0][0].lower() + facts[0][1:] if facts and len(facts[0]) > 1 else facts[0]}"
        if facts
        else f"{source_name} kaynaklı ilk çerçeveye göre bu gelişme, ilgili başlıkta somut bir değişime işaret ediyor."
    )

    detail_paragraph = " ".join(
        fact if fact.endswith((".", "!", "?")) else f"{fact}." for fact in facts[1:3]
    ).strip()
    if not detail_paragraph:
        detail_paragraph = (
            "Mevcut bilgiler, haberin erken çerçevesini kurmaya yetiyor; ancak yeni doğrulamalar geldikçe detay seviyesi de genişleyebilir."
        )

    third_paragraph = ""
    if len(facts) >= 4:
        extra = facts[3]
        if not extra.endswith((".", "!", "?")):
            extra = f"{extra}."
        third_paragraph = extra

    importance = _topic_context(item)

    review_note = ""
    public_notes = [
        note for note in item.notes[:3] if not note.startswith("autopublish-withdrawn:") and not note.startswith("manual-publish:")
    ]
    if public_notes:
        review_note = "\n## Editoryal not\n\n- " + "\n- ".join(public_notes) + "\n"

    supporting_sources_block = ""
    if item.supporting_sources:
        supporting_lines = "\n".join([f"- [{source.name}]({source.url})" for source in item.supporting_sources[:5]])
        supporting_sources_block = f"\n## Ek kaynaklar\n\n{supporting_lines}\n"

    body_parts = [
        opening,
        "",
        nutgraf,
        "",
        detail_paragraph,
    ]
    if third_paragraph:
        body_parts.extend(["", third_paragraph])

    body_parts.extend([
        "",
        "## Bağlam",
        "",
        importance,
    ])

    body = "\n".join(body_parts)

    return f"""{body}
{review_note}## Kaynaklar

- Ana kaynak: [{source_name}]({source_url})
{supporting_sources_block}"""
