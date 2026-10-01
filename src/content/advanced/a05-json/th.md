## explanation
JSON คือข้อความที่แลกกับโปรแกรมอื่น tag json บอกว่าฟิลด์ใน struct ใช้ชื่ออะไรในข้อความนั้น

```
type Person struct {
	Name string `json:"name"`
}

func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

ข้อมูล []byte(`{"name":"ann"}`) ให้ DecodeName คืน ann

## apply
อ่านชื่อจากข้อความที่ฝั่งเว็บส่งมา และสร้างข้อความ JSON กลับไปเมื่อต้องส่งชื่อออก

```
func EncodeName(name string) ([]byte, error) {
	person := Person{Name: name}
	return json.Marshal(person)
}
```

EncodeName("ann") ได้ {"name":"ann"}

## easy
DecodeName อ่านฟิลด์ name จาก JSON

```
func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

## hard
ถ้า JSON ไม่มีฟิลด์ name ให้คืนสตริงว่างและไม่มี error ไม่ใช่ถือว่าข้อมูลพัง

```
func DecodeName(data []byte) (string, error) {
	var person Person
	if err := json.Unmarshal(data, &person); err != nil {
		return "", err
	}
	return person.Name, nil
}
```

Person ที่ไม่มี name จะได้ Name เป็นสตริงว่างหลัง Unmarshal สำเร็จ
