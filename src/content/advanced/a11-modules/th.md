## explanation
go.mod คือบัตรประจำตัวของโมดูล บรรทัด module บอกชื่อโมดูล บรรทัด go บอกรุ่นภาษา บรรทัด require บันทึกว่าโมดูลนี้ต้องการโมดูลอื่นที่รุ่นที่ระบุ

```
module example.com/app

go 1.25

require golang.org/x/mod v0.21.0
```

require golang.org/x/mod v0.21.0 แปลว่าโปรแกรมนี้ใช้โมดูล golang.org/x/mod รุ่น v0.21.0

## apply
ของในโมดูล example.com/app คือ path ที่ขึ้นต้นด้วยชื่อนั้น ของนอกโมดูลคือ path อื่น เช่น golang.org/x/mod ไฟล์ go.work จัดหลายโมดูลบนดิสก์ให้พัฒนาพร้อมกัน และไม่แทนที่ go.mod

```
import "example.com/app/internal/web"
import "golang.org/x/mod/semver"
```

บรรทัดแรกอยู่ในโมดูล example.com/app บรรทัดที่สองอยู่นอกโมดูล

```
go 1.25

use ./app
use ./tools
```

go.work ชี้โฟลเดอร์โมดูลที่เปิดพัฒนาด้วยกัน แต่ละโฟลเดอร์ยังมี go.mod ของตัวเอง

## easy
บรรทัด require ใน go.mod บันทึกว่าโมดูลนี้ต้องการโมดูลนั้นที่รุ่นที่ระบุ

```
require golang.org/x/mod v0.21.0
```

## hard
go.work จัดหลายโมดูลบนดิสก์ให้พัฒนาพร้อมกัน import ที่อยู่นอก example.com/app คือ path ที่ไม่ได้ขึ้นต้นด้วยชื่อโมดูลนั้น เช่น golang.org/x/mod

```
go 1.25

use ./app
use ./tools
```

```
import "golang.org/x/mod/semver"
```
