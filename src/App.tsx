import { useState } from "react";
import {
    Button,
    Col,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Row,
    Select,
} from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import type { RuleObject } from "@rc-component/form/lib/interface";

enum PositionsType {
    Director = "Директор",
    AccountManager = "Менеджер по работе с клиентами",
    TechnicalSupport = "Специалист тех. поддержки",
}

interface IFormData {
    fullName: string;
    birthDate: Dayjs;
    experience: number;
    position: PositionsType;
    login: string;
    password?: string;
    email: string;
    phone?: string;
    note?: string;
}

const MOCK_FORM_DATA: IFormData = {
    fullName: "Волков Василий Валерьевич",
    birthDate: dayjs().subtract(42, "year"),
    experience: 5,
    position: PositionsType.TechnicalSupport,
    login: "user1984",
    password: "qwerty123",
    email: "user1984@gmail.com",
    phone: "79221110500",
    note: "Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности позволяет оценить значение форм воздействия",
};

export const App = () => {
    const [form] = Form.useForm<IFormData>();
    const [isEditMode, setEditMode] = useState(false);

    const onStartEdit = () => {
        setEditMode(true);
    };

    const onFinish = (values: IFormData) => {
        console.log("onFinish", values);
        setEditMode(false);
    };

    const onCancel = () => {
        form.resetFields();
        setEditMode(false);
    };

    const validateExperience = (rule: RuleObject, value: number) => {
        const birthDate: Dayjs = form.getFieldValue("birthDate");
        if (!value || !birthDate?.isValid()) {
            return Promise.resolve();
        }

        const age = dayjs().diff(birthDate, "year");
        if (value > age) {
            return Promise.reject(
                `Стаж не должен превышать возраст (${age} лет)`,
            );
        }

        return Promise.resolve();
    };

    return (
        <>
            <Form
                form={form}
                name={"user"}
                disabled={!isEditMode}
                onFinish={onFinish}
                layout={"vertical"}
                size={"large"}
                initialValues={MOCK_FORM_DATA}
            >
                <Form.Item
                    name={"fullName"}
                    label={"ФИО"}
                    rules={[
                        { required: true, message: "Обязательное поле" },
                        { max: 100, message: "Максимум 100 символов" },
                    ]}
                >
                    <Input />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={"birthDate"}
                            label={"Дата рождения"}
                            rules={[
                                {
                                    required: true,
                                    message: "Обязательное поле",
                                },
                            ]}
                        >
                            <DatePicker
                                style={{ width: "100%" }}
                                disabledDate={(current) => {
                                    return current && current > dayjs();
                                }}
                            />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"experience"}
                            label={"Стаж (лет)"}
                            rules={[{ validator: validateExperience }]}
                            dependencies={["birthDate"]}
                        >
                            <InputNumber
                                min={0}
                                max={100}
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item
                    name={"position"}
                    label={"Должность"}
                    rules={[{ required: true, message: "Обязательное поле" }]}
                >
                    <Select
                        options={Object.values(PositionsType).map((value) => ({
                            value,
                            label: value,
                        }))}
                    />
                </Form.Item>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={"login"}
                            label={"Логин"}
                            rules={[
                                {
                                    required: true,
                                    message: "Обязательное поле",
                                },
                                {
                                    min: 3,
                                    max: 20,
                                    message: "Логин 3-20 символов",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"password"}
                            label={"Пароль"}
                            rules={[
                                {
                                    min: 6,
                                    max: 12,
                                    message: "Пароль 6-12 символов",
                                },
                            ]}
                        >
                            <Input.Password />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item
                            name={"email"}
                            label={"Email"}
                            rules={[
                                {
                                    required: true,
                                    message: "Обязательное поле",
                                },
                                {
                                    type: "email",
                                    message: "Неверный формат email",
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={"phone"} label={"Номер телефона"}>
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item name={"note"} label={"Примечание"}>
                    <Input.TextArea showCount rows={4} maxLength={400} />
                </Form.Item>
            </Form>

            {isEditMode ? (
                <>
                    <Button
                        type={"primary"}
                        size={"large"}
                        onClick={() => form.submit()}
                        style={{ marginRight: 16 }}
                    >
                        Сохранить
                    </Button>
                    <Button size={"large"} onClick={onCancel}>
                        Отмена
                    </Button>
                </>
            ) : (
                <Button type={"primary"} size={"large"} onClick={onStartEdit}>
                    Изменить
                </Button>
            )}
        </>
    );
};
