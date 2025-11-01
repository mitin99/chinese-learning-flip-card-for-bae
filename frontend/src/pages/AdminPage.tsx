import { useState } from 'react';
import {
  Layout,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  message,
  Tag,
} from 'antd';
import { EditOutlined, DeleteOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCards, useUpdateCard, useDeleteCard } from '../hooks/useCards';
import type { Card as CardType, UpdateCardDto } from '../types';

const { Header, Content } = Layout;

export default function AdminPage() {
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [form] = Form.useForm();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading } = useCards();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const handleEdit = (card: CardType) => {
    setEditingCard(card);
    form.setFieldsValue({
      chinese: card.chinese,
      pinyin: card.pinyin || '',
      vietnamese: card.vietnamese,
      categories: card.categories?.join(', '),
    });
  };

  const handleUpdate = async (values: any) => {
    if (!editingCard) return;

    try {
      const categories = values.categories
        ? values.categories.split(',').map((c: string) => c.trim()).filter(Boolean)
        : [];

      const updateData: UpdateCardDto = {
        chinese: values.chinese,
        pinyin: values.pinyin || undefined,
        vietnamese: values.vietnamese,
        categories,
      };

      await updateCard.mutateAsync({ id: editingCard.id, data: updateData });
      message.success('Cập nhật thẻ thành công!');
      setEditingCard(null);
      form.resetFields();
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Cập nhật thẻ thất bại');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCard.mutateAsync(id);
      message.success('Xóa thẻ thành công!');
    } catch (error: any) {
      message.error(error?.response?.data?.message || 'Xóa thẻ thất bại');
    }
  };

  const columns = [
    {
      title: 'Tiếng Trung',
      dataIndex: 'chinese',
      key: 'chinese',
      width: 150,
    },
    {
      title: 'Pinyin',
      dataIndex: 'pinyin',
      key: 'pinyin',
      width: 150,
      render: (pinyin: string) => pinyin || '-',
    },
    {
      title: 'Tiếng Việt',
      dataIndex: 'vietnamese',
      key: 'vietnamese',
      width: 150,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categories',
      key: 'categories',
      render: (categories: string[]) => (
        <Space>
          {categories?.map((cat) => (
            <Tag key={cat}>{cat}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'isSystemCard',
      key: 'isSystemCard',
      render: (isSystem: boolean) => (
        <Tag color={isSystem ? 'blue' : 'green'}>
          {isSystem ? 'Hệ thống' : 'Người dùng'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: CardType) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa thẻ này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <Space>
          <Button
            icon={<HomeOutlined />}
            onClick={() => navigate('/')}
            type="text"
          >
            Về trang học
          </Button>
          <span style={{ fontWeight: 'bold' }}>Quản trị thẻ</span>
        </Space>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          Đăng xuất
        </Button>
      </Header>
      <Content style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <Table
            columns={columns}
            dataSource={cards}
            rowKey="id"
            loading={isLoading}
            pagination={{ pageSize: 10 }}
          />
        </div>
      </Content>

      <Modal
        title="Sửa thẻ"
        open={!!editingCard}
        onCancel={() => {
          setEditingCard(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          onFinish={handleUpdate}
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
              <Button
                type="primary"
                htmlType="submit"
                loading={updateCard.isPending}
              >
                Cập nhật
              </Button>
              <Button
                onClick={() => {
                  setEditingCard(null);
                  form.resetFields();
                }}
              >
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

