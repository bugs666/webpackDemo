// 类型守卫：使用is，typeof，instanceof以及in运算符来缩小类型的判断范围

type StringOrNumber = string | number;

interface Person {
    name: string;
}

interface Worker extends Person {
    workName: any;
}


// 基本类型守卫
function getStringOrNumber(value: StringOrNumber): string {
    return typeof value === 'string' ? value : value.toString();
}

// 自定义类型守卫 —— is守卫
function isString(value: any): value is string {
    return typeof value === 'string';
}

function alertMessage(value: StringOrNumber): any {
    if (isString(value)) {
        console.log(value.toUpperCase());
    }
}

// interface、object类型守卫 - in守卫
function alertPersonWorkInfo(person: Person | Worker): void {
    const name = person.name;
    if ('workName' in person) {
        console.log(`${name} is a ${person.workName} worker`)
        return;
    }
    console.log(`${name} is a person`);
}

// 联合类型守卫
function getPersonWorkInfo(person: Person | Worker): void {
    const name = person.name;
    if ('workName' in person && isString(person.workName)) {
        console.log(`${name} is a ${person.workName} worker`)
        return;
    }
    console.log(`${name} is a person`);
}
