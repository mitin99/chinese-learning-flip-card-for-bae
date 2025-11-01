import { Form, Input, Button, Modal, Space, message } from 'antd';
import { useCreateCard } from '../hooks/useCards';
import type { CreateCardDto } from '../types';

interface AddCardFormProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function AddCardForm({ onClose, onSuccess }: AddCardFormProps) {
  const [form] = Form.useForm();
  const createCard = useCreateCard();

  const handleSubmit = async (values: any) => {
    try {
      const categories = values.categories
        ? values.categories.split(',').map((c: string) => c.trim()).filter(Boolean)
        : [];
      
      const cardData: CreateCardDto = {
        chinese: values.chinese,
        pinyin: values.pinyin || undefined,
        vietnamese: values.vietnamese,
        categories,
      };

      await createCard.mutateAsync(cardData);
      message.success('Thêm thẻ thành công!');
      form.resetFields();
      onSuccess?.();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Thêm thẻ thất bại');
    }
  };

  return (
    <Modal
      title="Thêm thẻ mới"
      open={true}
      onCancel={onClose}
      footer={null}
      width={600}
    >
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        autoComplete="off"
      >
        <Form.Item
          name="chinese"
          label="Tiếng Trung"
          rules={[{ required: true, message: 'Vui lòng nhập tiếng Trung!' }]}
        >
          <Input placeholder="Nhập từ hoặc câu tiếng Trung" size="large" />
        </Form.Item>
        <Form.Item
          name="pinyin"
          label="Pinyin (Tùy chọn)"
        >
          <Input placeholder="Nhập Pinyin, ví dụ: nǐ hǎo" size="large" />
        </Form.Item>
        <Form.Item
          name="vietnamese"
          label="Tiếng Việt"
          rules={[{ required: true, message: 'Vui lòng nhập tiếng Việt!' }]}
        >
          <Input placeholder="Nhập nghĩa tiếng Việt" size="large" />
        </Form.Item>
        <Form.Item
          name="categories"
          label="Danh mục (phân cách bởi dấu phẩy)"
          extra="Ví dụ: Greetings, Common, Food"
        >
          <Input placeholder="Nhập danh mục, phân cách bởi dấu phẩy" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={createCard.isPending}>
              Thêm thẻ
            </Button>
            <Button onClick={onClose}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
}

