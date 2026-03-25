---
title: "Token"
description: "Bir istemcinin kimliğini veya yetkisini doğrulamak için kullanılan dijital anahtar benzeri değer."
category: "teknik-terimler"
summary: "Sisteme 'ben buyum ve buna yetkim var' demeni sağlayan erişim bileti."
example:
  title: "API erişimi"
  body: "Bir servise istek atarken header içine eklenen erişim değeri çoğu zaman bir token'dır; sistem bu sayede çağrının kimden geldiğini anlar."
confusedWith:
  - slug: "authentication"
    title: "Authentication"
    note: "Token bir araçtır; authentication ise kimlik doğrulama sürecinin tamamıdır."
related:
  - "authentication"
  - "authorization"
---

## Kısa tanım

Token, bir kullanıcının ya da uygulamanın kimliğini ve bazen yetkisini kanıtlamak için kullanılan değerdir.

## Basit anlatım

Etkinlik girişinde verilen bileklik gibi. İçeri girme hakkın olduğunu onunla kanıtlarsın.

## Ne zaman kullanılır?

- API erişiminde
- Oturum yönetiminde
- Güvenli servisler arasında doğrulama yaparken

## Dikkat edilmesi gerekenler

- Gizli tutulmalıdır
- Süresi dolabilir
- Yanlış elde saklanırsa güvenlik açığına dönüşebilir

## İlgili başlıklar

`authentication`, `authorization`
