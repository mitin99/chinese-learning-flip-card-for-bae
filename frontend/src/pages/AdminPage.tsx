import { useState, useMemo, useCallback } from 'react';
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
  Typography,
  Row,
  Col,
} from 'antd';
import { EditOutlined, DeleteOutlined, LogoutOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCards, useUpdateCard, useDeleteCard } from '../hooks/useCards';
import type { Card as CardType, UpdateCardDto } from '../types';
import './StudyPage.css'; // Reuse the same CSS for responsive text hiding

const { Header, Content } = Layout;
const { Text } = Typography;

export default function AdminPage() {
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [form] = Form.useForm();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { data: cards = [], isLoading } = useCards();
  const updateCard = useUpdateCard();
  const deleteCard = useDeleteCard();

  const handleEdit = useCallback(
    (card: CardType) => {
      setEditingCard(card);
      form.setFieldsValue({
        chinese: card.chinese,
        pinyin: card.pinyin || '',
        vietnamese: card.vietnamese,
        categories: card.categories?.join(', '),
      });
    },
    [form],
  );

  const handleUpdate = useCallback(
    async (values: any) => {
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
    },
    [editingCard, updateCard, form],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteCard.mutateAsync(id);
        message.success('Xóa thẻ thành công!');
      } catch (error: any) {
        message.error(error?.response?.data?.message || 'Xóa thẻ thất bại');
      }
    },
    [deleteCard],
  );

  const handleCloseModal = useCallback(() => {
    setEditingCard(null);
    form.resetFields();
  }, [form]);

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  // Memoize columns to prevent re-renders
  const columns = useMemo(
    () => [
      {
        title: 'Tiếng Trung',
        dataIndex: 'chinese',
        key: 'chinese',
        width: 120,
        fixed: 'left' as const,
      },
      {
        title: 'Pinyin',
        dataIndex: 'pinyin',
        key: 'pinyin',
        width: 120,
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
        width: 200,
        render: (categories: string[]) => (
          <Space wrap>
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
        width: 100,
        render: (isSystem: boolean) => (
          <Tag color={isSystem ? 'blue' : 'green'}>
            {isSystem ? 'Hệ thống' : 'Người dùng'}
          </Tag>
        ),
      },
      {
        title: 'Thao tác',
        key: 'actions',
        width: 150,
        fixed: 'right' as const,
        render: (_: any, record: CardType) => (
          <Space>
            <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} size="small">
              <span className="ant-btn-text-hidden-sm">Sửa</span>
            </Button>
            <Popconfirm
              title="Bạn có chắc muốn xóa thẻ này?"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
            >
              <Button icon={<DeleteOutlined />} danger size="small">
                <span className="ant-btn-text-hidden-sm">Xóa</span>
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ],
    [handleEdit, handleDelete],
  );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#fff',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          padding: '0 16px',
        }}
      >
        <Space wrap align="center">
          <Button icon={<HomeOutlined />} onClick={handleNavigateHome} type="text">
            <span className="ant-btn-text-hidden-sm">Về trang học</span>
          </Button>
          <Text strong>Quản trị thẻ</Text>
        </Space>
        <Button icon={<LogoutOutlined />} onClick={logout}>
          <span className="ant-btn-text-hidden-sm">Đăng xuất</span>
        </Button>
      </Header>
      <Content style={{ padding: '16px' }}>
        <Row>
          <Col xs={24}>
            <Table
              columns={columns}
              dataSource={cards}
              rowKey="id"
              loading={isLoading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
              size="small"
            />
          </Col>
        </Row>
      </Content>

      <Modal
        title="Sửa thẻ"
        open={!!editingCard}
        onCancel={handleCloseModal}
        footer={null}
        width={600}
        style={{ maxWidth: '95vw' }}
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
          <Form.Item name="pinyin" label="Pinyin (Tùy chọn)">
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
              <Button type="primary" htmlType="submit" loading={updateCard.isPending}>
                Cập nhật
              </Button>
              <Button onClick={handleCloseModal}>Hủy</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}
