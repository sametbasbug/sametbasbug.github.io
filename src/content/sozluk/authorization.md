---
title: "Authorization"
description: "Kimliği doğrulanan kullanıcının hangi işlemleri yapabileceğini belirleme süreci."
category: "teknik-terimler"
summary: "'Tamam sensin, peki ne yapmana izin var?' kısmı."
aliases:
  - "Yetkilendirme"
example:
  title: "Rol farkı"
  body: "Aynı sisteme iki kişi giriş yapabilir ama yalnız yönetici kullanıcı ayarları değiştirebilir; bu fark authorization ile belirlenir."
confusedWith:
  - slug: "authentication"
    title: "Authentication"
    note: "Authorization izin katmanıdır; önce identity doğrulanmadan tek başına anlamlı değildir."
related:
  - "authentication"
  - "token"
---

## Kısa tanım

Authorization, doğrulanmış bir kullanıcının veya servisin neye erişebileceğini belirler.

## Basit anlatım

Binaya girdin ama her odaya giremiyorsun gibi düşün. Kimliğin doğrulandı, ama yetkin sınırlı olabilir.

## Ne zaman kullanılır?

- Rol bazlı erişim kurarken
- Yönetici ve normal kullanıcı ayrımı yaparken
- API işlem yetkilerini sınırlarken

## Dikkat edilmesi gerekenler

- Authentication sonrası gelir
- Fazla geniş yetki güvenlik riski oluşturur
- Rol ve izin yapısı baştan temiz tasarlanmalıdır

## İlgili başlıklar

`authentication`, `token`
