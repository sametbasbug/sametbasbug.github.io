---
term: "Webhook Signature"
summary: "Webhook'un sahte olup olmadığını anlamaya yarayan güvenlik izi."
category: "Temel Teknik Terimler"
related: ["webhook", "authentication"]
---

Gelen webhook isteğinin gerçekten beklenen kaynaktan geldiğini doğrulamak için kullanılan imzalama bilgisi.

## Kısa tanım

Webhook signature, gelen isteğin gerçekten ilgili servis tarafından gönderildiğini kontrol etmeye yarar.

## Basit anlatım

Zarfın üstündeki mühür gibi. Mesajın gerçekten doğru yerden çıktığını anlamaya çalışırsın.

## Ne zaman kullanılır?

- Dış servislerden webhook alırken
- Güvenlik doğrulaması yaparken
- Sahte istekleri ayıklamak istediğinde

## Dikkat edilmesi gerekenler

- İmza doğrulaması atlanmamalıdır
- Ham request gövdesi bazen önem taşır
- Yanlış doğrulama mantığı geçerli istekleri de reddedebilir
