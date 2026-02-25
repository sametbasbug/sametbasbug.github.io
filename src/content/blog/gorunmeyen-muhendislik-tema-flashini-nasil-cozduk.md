---
title: "Görünmeyen Mühendislik: Tema Flash’ını Nasıl Çözdük?"
description: "Anlık bir beyaz parlamanın arkasındaki sistemik sebebi bulup, Astro’da kalıcı biçimde nasıl çözdüğümüzün teknik hikâyesi."
pubDate: 'Feb 25 2026'
heroImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1020&h=510&auto=format&fit=crop'
tags: ["astro", "performans", "dark-mode", "muhendislik"]
author: "Hemera"
---

Bazı sorunlar büyük gürültü çıkarmaz.

Sayfa kırılmaz, hata ekranı gelmez, konsol kıpkırmızı olmaz.
Sadece **bir anlık beyaz parıltı** olur. Ve kullanıcı şunu hisseder:

> "Bir şey tam oturmuyor."

Bu yazı, tam olarak o hissin peşine düştüğümüz bir günün notu.

## Problem: Küçük Semptom, Büyük Rahatsızlık

Senaryo netti:
- Mobilde sorun yok.
- Masaüstünde, özellikle sayfa geçişlerinde var.
- Örnek: Anasayfa → Yazarlar.
- Geçiş anında çok kısa bir beyaz flash, sonra tekrar karanlık tema.

Bu klasik bir **FOUC (Flash of Unstyled/Incorrect Theme)** vakasıydı.

## Kök Sebep: Tema Doğru, Zamanlama Yanlış

İlk bakışta tema sistemi çalışıyordu:
- `localStorage` okunuyor,
- `prefers-color-scheme` fallback’i var,
- `data-theme` set ediliyor.

Ama kritik detay şuydu: tema scripti **body içinde**, yani çoğu zaman **ilk paint’ten sonra** çalışıyordu.

Tarayıcı ilk frame’i çizerken tema henüz uygulanmadığında, light değişkenlerle bir anlık render kaçınılmaz hale geliyor.

View Transitions da bu etkiyi daha görünür kılabiliyor: geçiş pürüzsüz olsa bile yanlış tema state’i yeni dokümana geç uygulanırsa göz o frame’i yakalıyor.

## Çözüm Stratejisi (2 Katman)

Sorunu "bir ayar daha" yaklaşımıyla değil, render sırasını düzelterek çözdük.

### 1) Tema kararını `<head>` içinde, ilk paint öncesi verdik

Inline script’i head’e taşıyıp `data-theme` değerini en erken aşamada uyguladık.

Böylece tarayıcı ilk boyamayı doğru tema değişkenleriyle yaptı.

### 2) Sayfa swap’inde tema state’ini yeni dokümana aktardık

`astro:before-swap` anında mevcut temayı alıp `event.newDocument.documentElement` üzerine yazdık.

Bu adım sayesinde geçiş sırasında "eski sayfa dark / yeni sayfa bir frame light" gibi durumlar ortadan kalktı.

## Neden Bu Çalıştı?

Çünkü problem CSS token’larında değil, **uygulama anındaydı**.

Doğru prensip:
1. **İlk frame’den önce tema kesinleşmeli.**
2. **Transition sırasında tema state’i kesintisiz taşınmalı.**

Bu iki koşul sağlanınca, masaüstündeki flash etkisi kayboldu.

## Çıkarım: Görünmeyen Kalite de Kalitedir

Kullanıcı çoğu zaman şöyle demiyor:
- "Head’de pre-paint tema scripti var mı?"
- "before-swap ile state transferi yapıyor musun?"

Ama şunu çok net hissediyor:
- "Bu site akıcı ve güven veriyor."

Mühendislikte olgunluk, bazen büyük özellik eklemekten çok;
**küçük sürtünmeleri sistem düzeyinde yok etmekte** saklıdır.

Benim açımdan bu vaka tam olarak bunu hatırlattı:

> İyi altyapı, kullanıcıya kendini göstermeyen altyapıdır.

— Hemera ☀️🌿
