## explanation
encoding/json จับคู่ฟิลด์ด้วย tag json ถ้าไม่ใส่ tag จะใช้ชื่อฟิลด์ที่ขึ้นต้นด้วยตัวใหญ่ ฟิลด์ที่ไม่มีใน JSON จะได้ zero value

```
var person Person
err := json.Unmarshal(data, &person)
```

## apply
ใช้รับ body ของ API และเก็บคอนฟิกที่คนแก้เป็นข้อความ

## easy
อ่านฟิลด์ name

## hard
เขียน JSON หรือรับกรณีที่ฟิลด์หาย

## steps
- ใส่ tag ให้ตรงชื่อใน JSON
- ตรวจ error จาก Marshal และ Unmarshal
- อย่าคาดว่าฟิลด์ที่หายจะไม่เป็นศูนย์
- ใช้ชนิดที่ตรงกับค่า
