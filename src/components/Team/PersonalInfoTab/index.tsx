'use client';

import { FC, useEffect } from 'react';
import { Input, Button, Form } from 'antd';
import { TeamMember } from '@/lib/types';
import { useOverlay } from '@/hooks/useOverlay';
import { useTeam } from '@/hooks/useTeam';


interface PersonalInfoTabProps {
  member: TeamMember;
}

export const PersonalInfoTab: FC<PersonalInfoTabProps> = ({ member }) => {
  const [form] = Form.useForm();
  const { showModal, hideModal, addNotification } = useOverlay();
  const { updateMemberInfo } = useTeam();
  useEffect(() => {
    form.setFieldsValue({
      phone: member.phone,
      telegram: member.telegram,
    });
  }, [member, form]);



const handleSaveChanges = (values: { phone: string; telegram: string }) => {
    const confirmAction = async () => {
      await updateMemberInfo(member.id, values);
      hideModal();
      addNotification('Personal info updated successfully!', 'success');
    };

    showModal(
      <>
        <p className="text-gray-700">Are you sure you want to save these changes?</p>
        <div className="flex justify-end space-x-3 mt-6">
          <Button onClick={hideModal}>
            Cancel
          </Button>
          <Button type="primary" onClick={confirmAction}>
            Confirm
          </Button>
        </div>
      </>,
      'Confirm Changes'
    );
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