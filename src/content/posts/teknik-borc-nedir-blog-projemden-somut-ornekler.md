---
title: "Teknik Borç Nedir? Blog Projemizden Somut Örnekler"
summary: "Teknik borcun sadece büyük ekiplerin sorunu olmadığını, kendi Astro blog projemizde yaşadığımız gerçek örneklerle anlatıyorum."
date: 2026-03-18
author: hemera
tags: ["astro", "mimari", "muhendislik"]
---

Bir projeyi bozup dağıtan şey çoğu zaman tek bir büyük hata değildir. Asıl sorun, “şimdilik böyle kalsın” diye ertelenen küçük kararların zamanla birikmesidir. Yazılım dünyasında buna **teknik borç** diyoruz.

Bu yazıda teknik borcu teorik tanımlarla değil, kendi blog projemizde yaşadığımız gerçek durumlarla anlatacağım. Çünkü teknik borç, en net şekilde üretimde çalışan bir projede görünür olur.

## Teknik Borç Nedir?

Teknik borç, hızlı ilerlemek için bugün verilen ama yarın maliyet çıkaran teknik kararlardır.

- Kötü bir şey olmak zorunda değildir.
- Bazen bilinçli olarak alınır.
- Sorun, borcun kendisinden çok **takip edilmemesidir**.

### Finansal borç gibi düşünelim:

- Anaparayı (asıl işi) bugün hızlıca alırsın.
- Faizi (bakım maliyeti) zamanla ödersin.
- Yönetmezsen faiz katlanır, ekip hızını keser.

## Blog Projesinden Somut Örnek 1: Astro 6 Geçişinde Kırılan Rota Mantığı

Projemizde Astro 6 geçişinden sonra yazı detay sayfalarında rota/link tarafında sorunlar ortaya çıktı. Eski akışta `post.slug` varsayımıyla giden yerleri, yeni yapıya göre `post.id` ile uyumlu hale getirmemiz gerekti. Bu tip geçişler, tek başına küçük görünse bile aslında proje [environment](/sozluk/environment/) ve rota mantığına bağlı birikmiş kararları görünür kılıyor.

İlk bakışta küçük bir refactor gibi görünse de etkisi büyüktü:

- Ana sayfa kart linkleri,
- Yazar sayfaları,
- RSS ve diğer içerik akışları,
- Detay sayfasına giden tüm yollar

tek tek etkilendi.

Bu durum bize şunu öğretti: **“Merkezi rota kuralı” yoksa her yeni özellik teknik borç faizini artırır.**

## Somut Örnek 2: Kodlama/Encoding Sorunları

Türkçe karakter içeren dosyalarda geniş kapsamlı otomatik rewrite işlemleri, bazı dosyalarda karakter bozulmasına (mojibake) yol açtı. Bu da şu sonuçları doğurdu:

- Metin kalitesinin düşmesi,
- Sayfa güvenilirliğinin zedelenmesi,
- Küçük görünen bir düzeltmenin bile manuel kontrole ihtiyaç duyması

Buradaki teknik borç koddan çok **süreç borcuydu**: “Hızlıca toplu dönüştürelim” alışkanlığı, içerik kalitesine risk yazdı.

## Somut Örnek 3: Ortak Kabuk (AppShell) Öncesi Dağınık UI Yapısı

Farklı sayfalar kendi kabuk mantıklarıyla ilerlediğinde, bir yerde yapılan iyileştirme diğer yüzeylere yansımıyordu. Bu da:

- tutarsız kullanıcı deneyimi,
- tekrar eden stil/kod,
- daha zor bakım

üretiyordu.

`AppShell` yaklaşımına geçmek bu borcun bir kısmını kapattı. Çünkü ortak iskelet sayesinde bir kez yapılan iyileştirme birden fazla sayfaya taşınabildi.

## Teknik Borcun Belirtileri

Kendi projende teknik borcun arttığını genelde şu işaretlerden anlarsın:

1.  Basit bir değişiklik beklenenden uzun sürüyorsa,
2.  Aynı bug farklı sayfalarda tekrar ediyorsa,
3.  “Bu dosyaya dokunmayalım, kesin bir şey bozulur” hissi oluşuyorsa,
4.  Her düzeltme sonrası ekstra sıcak yama gerekiyorsa.

## Teknik Borcu Azaltmak İçin Kullandığımız Pratikler

Bizim projede işe yarayan yaklaşım seti şu oldu:

### 1) Önce tek kaynaklı doğruluk (Single Source of Truth)

Rota, layout ve ortak UI kurallarını mümkün olduğunca tek yerde toplamak.

### 2) Küçük ama düzenli refactor

Biriken sorunları “bir gün büyük temizlik” yerine, her geliştirme sırasında küçük parçalar halinde azaltmak.

### 3) Build’i zorunlu kalite kapısı yapmak

Yayın öncesinde [`npm run build`](/sozluk/npm-run-build/) çalıştırmadan ilerlememek.

### 4) Karar günlüğü tutmak

Neyi neden değiştirdiğimizi not etmek; böylece aynı hataya geri düşmemek.

## Ne Zaman Borç Alınır, Ne Zaman Ödenir?

Her teknik borç kötü değildir. Bazı dönemlerde hız gerçekten kritiktir. Ama bunun koşulu şudur:

- Borcu **bilinçli** al,
- Etkisini **ölç**,
- Ödeme tarihini **takvime yaz**.

Eğer bu üçü yoksa, borç teknik değil doğrudan operasyonel riske dönüşür.

## Kapanış

Bugün geldiğimiz noktada tasarımın oturması çok önemli bir kazanım. Bundan sonraki içerik ve özellik geliştirmelerinde hız kadar sürdürülebilirliği de korursak, blog uzun vadede daha güçlü bir ürüne dönüşecek.

Kısacası:

> Teknik borç sıfırlanmaz, yönetilir.

Bu başlığın doğal devamında şu soru öne çıkıyor: **“Küçük bir blog projesi için ideal haftalık bakım rutini nasıl olmalı?”**
