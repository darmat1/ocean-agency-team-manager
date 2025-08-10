'use client';

import { useEffect } from 'react';
import { Input, Button, Form, message } from 'antd';
import { TeamMember } from '@/lib/types';
import { useTeam } from '@/hooks/useTeam';

interface PersonalInfoTabProps {
  member: TeamMember;
}

export const PersonalInfoTab = ({ member }: PersonalInfoTabProps) => {
  const { members, setMembers } = useTeam();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      phone: member.phone,
      telegram: member.telegram,
    });
  }, [member, form]);

  const handleSaveChanges = (values: { phone: string; telegram: string }) => {
    const updatedMembers = members.map(m =>
      m.id === member.id ? { ...m, ...values } : m
    );
    setMembers(updatedMembers);
    message.success('Information saved successfully!');
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSaveChanges}
        initialValues={{ phone: member.phone, telegram: member.telegram }}
      >
        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please input a phone number!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="telegram"
          label="Telegram Nickname"
          rules={[{ required: true, message: 'Please input a Telegram nickname!' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};