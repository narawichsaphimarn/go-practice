## explanation
บรรทัด go ใน go.mod คือรุ่นภาษาขั้นต่ำของโมดูล บรรทัด toolchain ถ้าระบุ จะขอ toolchain นั้น GOTOOLCHAIN=local หมายถึงใช้ toolchain ที่ติดตั้งอยู่ ไม่ดาวน์โหลดเพิ่ม Go 1.25 ยังใช้กติกานี้

```
go 1.25

toolchain go1.25.0
```

## apply
ใช้ตอนล็อกเวอร์ชันใน CI และตอนกันไม่ให้เครื่องพัฒนาไปดึง toolchain คนละรุ่นเงียบๆ

## easy
ความหมายของบรรทัด go

## hard
toolchain กับ GOTOOLCHAIN=local

## steps
- แยกบรรทัด go ออกจากบรรทัด toolchain
- รู้ว่า local ไม่ดาวน์โหลด
- อย่าเดาว่ารุ่นภาษาเท่ากับรุ่นไบนารีเสมอ
- ตอบในหน้านี้
