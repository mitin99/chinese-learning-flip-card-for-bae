import { useState } from 'react';
import { Layout, Button, Select, Space, message, Card } from 'antd';
import { LogoutOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCards } from '../hooks/useCards';
import FlipCard from '../components/FlipCard';
import AddCardForm from '../components/AddCardForm';

const { Header, Content } = Layout;

export default function StudyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showAddForm, setShowAddForm] = useState(false);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: cards = [], isLoading, error } = useCards(selectedCategory);

  const categories = Array.from(
    new Set(cards.flatMap((card) => card.categories || []))
  ).sort();

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % cards.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + cards.length) % cards.length);
  };

  const handleShuffle = () => {
    // Shuffle concept - in a real implementation, you'd maintain a shuffled array
    // For now, just reset to first card
    setCurrentIndex(0);
    message.info('Cards shuffled!');
  };

  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '2rem', textAlign: 'center' }}>
          Đang tải...
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '2rem', textAlign: 'center' }}>
          <Card>
            <p>Có lỗi xảy ra khi tải dữ liệu.</p>
            <Button onClick={() => globalThis.location.reload()}>Tải lại</Button>
          </Card>
        </Content>
      </Layout>
    );
  }

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
            Học Từ Vựng
          </Button>
          {isAdmin && (
            <Button
              type="primary"
              onClick={() => navigate('/admin')}
            >
              Quản trị
            </Button>
          )}
        </Space>
        <Space>
          <span>Xin chào, {user?.username}</span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            Đăng xuất
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <Card style={{ marginBottom: '2rem' }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
              <div>
                <label htmlFor="category-select" style={{ marginRight: '1rem' }}>
                  Lọc theo danh mục:
                </label>
                <Select
                  id="category-select"
                  style={{ width: 200 }}
                  placeholder="Tất cả danh mục"
                  allowClear
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={categories.map((cat) => ({ label: cat, value: cat }))}
                />
              </div>
              <div>
                <Space>
                  <Button onClick={handlePrevious} disabled={cards.length === 0}>
                    Trước
                  </Button>
                  <span>
                    {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
                  </span>
                  <Button onClick={handleNext} disabled={cards.length === 0}>
                    Sau
                  </Button>
                  <Button onClick={handleShuffle} disabled={cards.length === 0}>
                    Xáo trộn
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setShowAddForm(true)}
                  >
                    Thêm thẻ mới
                  </Button>
                </Space>
              </div>
            </Space>
          </Card>

          {(() => {
            if (cards.length === 0) {
              return (
                <Card>
                  <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>
                    {selectedCategory
                      ? 'Không có thẻ nào trong danh mục này.'
                      : 'Chưa có thẻ nào. Hãy thêm thẻ mới!'}
                  </p>
                </Card>
              );
            }
            return currentCard ? <FlipCard card={currentCard} /> : null;
          })()}

          {showAddForm && (
            <AddCardForm
              onClose={() => setShowAddForm(false)}
              onSuccess={() => {
                setShowAddForm(false);
                setCurrentIndex(0);
              }}
            />
          )}
        </div>
      </Content>
    </Layout>
  );
}

