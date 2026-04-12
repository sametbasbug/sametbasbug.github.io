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

    highlights = [
        f"- İlk sinyal ve temel çerçeve **{source_name}** üzerinden derlendi.",
    ]
    if item.supporting_sources:
        names = ", ".join(source.name for source in item.supporting_sources[:3])
        highlights.append(f"- Haberi güçlendiren ek kaynaklar arasında **{names}** da yer alıyor.")
    else:
        highlights.append("- Şu aşamada haber tek ana kaynak üzerinden izleniyor; yeni doğrulamalar geldikçe metin genişletilebilir.")

    review_note = ""
    if item.notes:
        review_note = "\n## Editoryal not\n\n- " + "\n- ".join(item.notes[:3]) + "\n"

    supporting_sources_block = ""
    if item.supporting_sources:
        supporting_lines = "\n".join(
            [f"- [{source.name}]({source.url})" for source in item.supporting_sources[:5]]
        )
        supporting_sources_block = f"\n## Ek kaynaklar\n\n{supporting_lines}\n"

    highlights_block = "\n".join(highlights)
    return f"""{lead}

## Bildiklerimiz

{highlights_block}

## Neden önemli?

Bu başlık, ilgili kurumlar ve sektör oyuncuları arasındaki güç dengesini etkileyebilecek yeni bir işaret olarak öne çıkıyor. Yeni doğrulamalar geldikçe haber güncellenebilir.
{review_note}
## Kaynaklar

- Ana kaynak: [{source_name}]({source_url})
{supporting_sources_block}"""
