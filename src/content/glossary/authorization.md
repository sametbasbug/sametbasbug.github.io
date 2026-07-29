---
term: "Authorization"
summary: "'Tamam sensin, peki ne yapmana izin var?' kısmı."
category: "Temel Teknik Terimler"
related: ["authentication", "token"]
---

Kimliği doğrulanan kullanıcının hangi işlemleri yapabileceğini belirleme süreci.

> **Rol farkı** — Aynı sisteme iki kişi giriş yapabilir ama yalnız yönetici kullanıcı ayarları değiştirebilir; bu fark authorization ile belirlenir.

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
