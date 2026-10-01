## explanation
var ประกาศตัวแปรโดยไม่กำหนดค่า จะได้ zero value: int เป็น 0, string เป็นว่าง, bool เป็น false

```
var count int
fmt.Println(count)
```

:= ประกาศพร้อมค่าเริ่มและให้คอมไพเลอร์อนุมานชนิด

## apply
ใช้ตอนอ่าน config ที่ยังไม่ถูกตั้ง และตอนออกแบบ struct ที่ฟิลด์ว่างต้องมีความหมายชัด

## easy
พิมพ์ zero value ของ int

## hard
พิมพ์ค่าจากตัวแปร string หรือ zero value ของ bool

## steps
- ประกาศตัวแปร
- อย่าใส่ค่าเริ่มถ้าต้องการ zero value
- พิมพ์ค่า
- เทียบกับที่โจทย์ขอ
