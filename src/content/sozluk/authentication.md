---
title: "Authentication"
description: "Bir kullanıcının ya da sistemin gerçekten iddia ettiği kimlik olup olmadığını doğrulama süreci."
category: "teknik-terimler"
summary: "Önce 'kimsin?' sorusunu cevaplayan güvenlik katmanı."
aliases:
  - "Kimlik doğrulama"
example:
  title: "Basit örnek"
  body: "E-posta ve şifreyle giriş yaptığında sistem önce gerçekten o hesap sahibi olup olmadığını kontrol eder; bu authentication kısmıdır."
confusedWith:
  - slug: "authorization"
    title: "Authorization"
    note: "Authentication kim olduğunu doğrular; authorization ise ne yapmana izin olduğunu belirler."
related:
  - "authorization"
  - "token"
---

## Kısa tanım

Authentication, sisteme gelen kişinin ya da servisin gerçekten o kişi ya da servis olup olmadığını kontrol eder.

## Basit anlatım

Kapıdaki görevlinin kimlik sorması gibi. Önce kim olduğunu kanıtlarsın.

## Ne zaman kullanılır?

- Giriş yaparken
- API erişimi verirken
- Korumalı alanlara erişim sağlarken

## Dikkat edilmesi gerekenler

- Authentication ile authorization aynı şey değildir
- Güçlü parola ve ek doğrulama yöntemleri önemlidir
- Kimlik doğrulandı diye her şeye izin verilmez

## İlgili başlıklar

`authorization`, `token`
