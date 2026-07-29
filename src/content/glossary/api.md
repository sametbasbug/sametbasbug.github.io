---
term: "API"
summary: "İki sistemin birbiriyle kontrollü şekilde konuşma yolu."
category: "Temel Teknik Terimler"
related: ["webhook", "rate-limit"]
---

Uygulamaların birbirine düzenli biçimde veri ya da komut göndermesini sağlayan arayüz.

> **Günlük hayattan örnek** — Bir hava durumu uygulamasının başka bir servise 'İstanbul için sıcaklığı ver' diye istek atması API kullanımına örnektir.

## Kısa tanım

API, bir uygulamanın başka bir uygulamayla konuşmak için kullandığı düzenli kapıdır.

## Basit anlatım

Bir restoran menüsü gibi düşünebilirsin. Sen menüden ne istediğini söylersin, mutfak da sana sonucu getirir. Mutfakta ne olduğuna karışmazsın; önemli olan hangi isteğin hangi sonuçla döndüğüdür.

## Ne zaman kullanılır?

- Dış servisten veri çekerken
- Kendi sisteminin verisini başka bir uygulamaya açarken
- Otomasyon akışlarında uygulamaları birbirine bağlarken

## Dikkat edilmesi gerekenler

- Kimlik doğrulama gerekebilir
- Her isteğin bir hata ihtimali vardır
- Çok sık istek atarsan rate limit’e takılabilirsin
