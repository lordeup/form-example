import { useState, useEffect } from "react";
import "./App.css";
import { Form, Input, DatePicker, Select, Button, Row, Col } from "antd";
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
    birthDate: dayjs().subtract(25, "year"),
    experience: 5,
    position: PositionsType.TechnicalSupport,
    login: "user1985",
    password: "qwerty123",
    email: "user1985@gmail.com",
    phone: "79221110500",
    note: "Значимость этих проблем настолько очевидна, что постоянный количественный рост и сфера нашей активности позволяет оценить значение форм воздействия",
};

export const App = () => {
    const [form] = Form.useForm<IFormData>();
    const [isEditMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState<IFormData>(MOCK_FORM_DATA);

    useEffect(() => {
        form.setFieldsValue(formData);
    }, []);

    const onStartEdit = () => {
        setEditMode(true);
    };

    const onCancelEdit = () => {
        setEditMode(false);
    };

    const onFinish = (values: IFormData) => {
        console.log("onFinish", values);
        setFormData(values);
        onCancelEdit();
        form.setFieldsValue(values);
    };

    const onCancel = () => {
        form.resetFields();
        form.setFieldsValue(formData);
        onCancelEdit();
    };

    const validateExperience = (rule: RuleObject, value: number) => {
        console.warn("value", value);
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
                // initialValues={{ remember: true }}
                // style={{ maxWidth: 600, width: "100%" }}
            >
                <Form.Item
                    name={"fullName"}
                    label={"ФИО"}
                    rules={[
                        { required: true, message: "Обязательное поле" },
                        { max: 100, message: "Максимум 100 символов" },
                    ]}
                >
                    <Input maxLength={100} />
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
                            dependencies={["experience"]}
                        >
                            <DatePicker style={{ width: "100%" }} />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                            name={"experience"}
                            label={"Стаж (лет)"}
                            rules={[
                                { max: 100, message: "Максимум 100 лет" },
                                { validator: validateExperience },
                            ]}
                        >
                            <Input
                                type={"number"}
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
                                { min: 3, message: "Минимум 3 символа" },
                                { max: 20, message: "Максимум 20 символов" },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name={"password"} label={"Пароль"}>
                            <Input.Password maxLength={12} />
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
                        onClick={() => form.submit()}
                        style={{ marginRight: 16 }}
                    >
                        Сохранить
                    </Button>
                    <Button onClick={onCancel}>Отмена</Button>
                </>
            ) : (
                <Button type={"primary"} onClick={onStartEdit}>
                    Изменить
                </Button>
            )}
        </>
    );
};
