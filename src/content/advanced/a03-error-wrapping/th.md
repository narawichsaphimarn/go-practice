## explanation
fmt.Errorf พร้อม %w ห่อ error เดิมไว้ errors.Is เดินสายห่อเพื่อเทียบค่า sentinel errors.As ดึงชนิดที่ต้องการออกมา การเทียบข้อความ error ทำให้พังเมื่อมีคนแก้ประโยค

```
return fmt.Errorf("open: %w", err)
```

## apply
ใช้เมื่อข้ามชั้นของโปรแกรมแล้วผู้เรียกยังต้องรู้ว่าสาเหตุคือ ErrNotFound หรือชนิดที่มีรหัส

## easy
ห่อแล้วใช้ errors.Is

## hard
ใช้ errors.As กับชนิดของตัวเอง

## steps
- ห่อด้วย %w
- ประกาศ sentinel ด้วย errors.New
- ตรวจด้วย Is หรือ As
- อย่าใช้ strings.Contains กับ Error()
