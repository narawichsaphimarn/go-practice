## explanation
โมดูลคือหนึ่งโปรเจกต์ Go ที่มีไฟล์ `go.mod` อยู่ที่โฟลเดอร์บนสุด go.mod เปรียบเหมือนบัตรประจำตัวของโปรเจกต์

```
module example.com/app

go 1.25

require golang.org/x/mod v0.21.0
```

- `module` คือชื่อของโมดูล และเป็นต้นทางของ import path ทุกตัวในโปรเจกต์
- `go` คือรุ่นภาษาที่โปรเจกต์ใช้
- `require` คือโมดูลอื่นที่โปรเจกต์นี้ใช้ พร้อมรุ่นที่ใช้

Go ยังสร้างไฟล์ `go.sum` เก็บค่า checksum ของโมดูลที่ดาวน์โหลดมา เพื่อตรวจว่าโค้ดไม่ถูกแก้ระหว่างทาง ไฟล์นี้ต้อง commit คู่กับ go.mod

## apply
แยกให้ออกว่า import ไหนอยู่ในหรือนอกโมดูล โดยดูว่า path ขึ้นต้นด้วยชื่อโมดูลไหม

```
import "example.com/app/internal/web"
import "golang.org/x/mod/semver"
```

บรรทัดแรกอยู่ในโมดูล example.com/app บรรทัดที่สองมาจากโมดูลอื่น จึงต้องมี require ใน go.mod

คำสั่งที่ใช้บ่อย:

- `go mod tidy` อ่าน import ทั้งหมดในโค้ด แล้วเพิ่ม require ที่ขาดและลบตัวที่ไม่ใช้
- `go get golang.org/x/mod@v0.22.0` เปลี่ยนรุ่นของโมดูลที่ใช้

เมื่อต้องแก้หลายโมดูลบนเครื่องพร้อมกัน ใช้ไฟล์ `go.work` ชี้ไปที่โฟลเดอร์ของแต่ละโมดูล go.work ใช้แค่ตอนพัฒนาและไม่ได้แทน go.mod แต่ละโมดูลยังมี go.mod ของตัวเอง

```
go 1.25

use ./app
use ./lib
```

## easy
ตัวอย่าง: อ่าน go.mod ของร้านค้าออนไลน์

```
module shop.example.com/api

go 1.25

require github.com/google/uuid v1.6.0
```

ชื่อโมดูลคือ `shop.example.com/api` ใช้ Go รุ่น 1.25 และใช้โมดูล `github.com/google/uuid` รุ่น v1.6.0

## hard
ตัวอย่าง: โมดูลเดียวกันนี้มีโฟลเดอร์ `internal/order` และ `cmd/server`

```
import "shop.example.com/api/internal/order"
import "github.com/google/uuid"
```

บรรทัดแรกอยู่ในโมดูลเพราะขึ้นต้นด้วย `shop.example.com/api` และโฟลเดอร์ชื่อ internal ทำให้มีแค่โค้ดในโมดูลนี้ที่ import ได้ บรรทัดที่สองเป็นของโมดูลอื่นที่ต้องมี require อยู่ใน go.mod
