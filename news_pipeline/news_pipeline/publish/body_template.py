from __future__ import annotations

from news_pipeline.models.queue import QueueItem


PLACEHOLDER_BODY_MARKERS = {
    "Bu taslak, hızlı yayın hazırlığı için oluşturuldu.",
    "Son yayına alınmadan önce başlık tonu, bağlam ve gerekiyorsa ikinci kaynak kontrolü yapılmalıdır.",
    "Mevcut metin, yayın öncesi hazırlık katmanıdır; nihai sürüm değildir.",
}


def build_body(item: QueueItem) -> str:
    lead = item.draft_description.strip()
    source_name = item.draft_sources[0].name if item.draft_sources else "ilk kaynak"
    source_url = item.draft_sources[0].url if item.draft_sources else "https://example.com"

    facts = [fact for fact in item.draft_facts if fact and fact.strip()]
    if not facts:
        facts = [f"İlk sinyal ve temel çerçeve {source_name} üzerinden derlendi."]
    facts_block = "\n".join([f"- {fact}" for fact in facts[:3]])

    importance = "Bu başlık, kısa vadede platformun yönünü ya da ilgili aktörler arasındaki güç dengesini etkileyebilecek somut bir değişime işaret ediyor. Yeni doğrulamalar geldikçe haber güncellenebilir."
    text = f"{item.draft_title} {item.draft_description}".lower()
    if any(term in text for term in ["x", "chatgpt", "openai", "anthropic", "google", "ai"]):
        importance = "Bu gelişme, teknoloji şirketlerinin ürün, gelir modeli veya rekabet dengesinde somut bir yön değişimine işaret ettiği için önemli. Etkisi, kullanıcı davranışı ve sektör rekabeti üzerinde hızla hissedilebilir."
    elif any(term in text for term in ["seçim", "orbán", "trump", "iran", "ukrayna", "rusya"]):
        importance = "Bu başlık, siyasi güç dengesi ve dış politika tartışmaları üzerinde etkisi olabilecek yeni bir işaret taşıyor. Özellikle seçim, liderlik ve jeopolitik gerilim ekseninde yankısı büyüyebilir."

    review_note = ""
    public_notes = [note for note in item.notes[:3] if not note.startswith("autopublish-withdrawn:") and not note.startswith("manual-publish:")]
    if public_notes:
        review_note = "\n## Editoryal not\n\n- " + "\n- ".join(public_notes) + "\n"

    supporting_sources_block = ""
    if item.supporting_sources:
        supporting_lines = "\n".join(
            [f"- [{source.name}]({source.url})" for source in item.supporting_sources[:5]]
        )
        supporting_sources_block = f"\n## Ek kaynaklar\n\n{supporting_lines}\n"

    return f"""{lead}

## Bildiklerimiz

{facts_block}

## Neden önemli?

{importance}
{review_note}
## Kaynaklar

- Ana kaynak: [{source_name}]({source_url})
{supporting_sources_block}"""
