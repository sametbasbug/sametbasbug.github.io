from __future__ import annotations

from news_pipeline.models.queue import QueueItem


def build_body(item: QueueItem) -> str:
    lead = item.draft_description.strip()
    source_name = item.draft_sources[0].name if item.draft_sources else "ilk kaynak"
    source_url = item.draft_sources[0].url if item.draft_sources else "https://example.com"
    review_note = ""
    if item.notes:
        review_note = "\n## Editoryal not\n\n- " + "\n- ".join(item.notes[:3]) + "\n"
    supporting_sources_note = ""
    supporting_sources_block = ""
    if item.supporting_sources:
        names = ", ".join(source.name for source in item.supporting_sources[:3])
        supporting_sources_note = f"- Bu taslağı güçlendiren ek kaynaklar da bulundu: **{names}**.\n"
        supporting_lines = "\n".join(
            [f"- [{source.name}]({source.url})" for source in item.supporting_sources[:5]]
        )
        supporting_sources_block = f"\n## Ek kaynaklar\n\n{supporting_lines}\n"
    return f"""{lead}

Bu taslak, hızlı yayın hazırlığı için oluşturuldu. Son yayına alınmadan önce başlık tonu, bağlam ve gerekiyorsa ikinci kaynak kontrolü yapılmalıdır.

## Neler biliyoruz?

- İlk sinyal ve temel çerçeve **{source_name}** üzerinden derlendi.
- Açıklama bölümü, haberin ana omurgasını kısa ve hızlı biçimde görünür kılmak için hazırlandı.
{supporting_sources_note}- Gerekirse bu gövdeye ek bağlam, karşı görüş veya ikinci kaynak eklenmelidir.

## Neden önemli?

Bu gelişmenin etkisi, kapsamı ve gerçek haber değeri son edit aşamasında netleştirilmelidir. Mevcut metin, yayın öncesi hazırlık katmanıdır; nihai sürüm değildir.
{review_note}
## Kaynaklar

- Ana kaynak: [{source_name}]({source_url})
{supporting_sources_block}"""
