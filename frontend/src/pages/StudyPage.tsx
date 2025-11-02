import { useState, useMemo, useCallback } from 'react';
import { Layout, Button, Select, Space, message, Card, Row, Col, Typography, FloatButton } from 'antd';
import { LogoutOutlined, PlusOutlined, HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCards } from '../hooks/useCards';
import FlipCard from '../components/FlipCard';
import AddCardForm from '../components/AddCardForm';
import type { Card as CardType } from '../types';
import './StudyPage.css';

const { Text } = Typography;

const { Header, Content } = Layout;

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function StudyPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [showAddForm, setShowAddForm] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: cards = [], isLoading, error } = useCards(selectedCategory);

  // Memoize categories list
  const categories = useMemo(() => {
    return Array.from(new Set(cards.flatMap((card) => card.categories || []))).sort();
  }, [cards]);

  // Memoize shuffled indices when cards change
  const activeIndices = useMemo(() => {
    if (shuffledIndices.length === cards.length) {
      return shuffledIndices;
    }
    return Array.from({ length: cards.length }, (_, i) => i);
  }, [cards.length, shuffledIndices]);

  // Memoize current card
  const currentCard = useMemo(() => {
    if (cards.length === 0 || activeIndices.length === 0) return null;
    const actualIndex = activeIndices[currentIndex];
    return cards[actualIndex] || null;
  }, [cards, activeIndices, currentIndex]);

  const handleNext = useCallback(() => {
    if (activeIndices.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % activeIndices.length);
  }, [activeIndices.length]);

  const handlePrevious = useCallback(() => {
    if (activeIndices.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + activeIndices.length) % activeIndices.length);
  }, [activeIndices.length]);

  const handleShuffle = useCallback(() => {
    if (cards.length === 0) return;
    const newShuffled = shuffleArray(Array.from({ length: cards.length }, (_, i) => i));
    setShuffledIndices(newShuffled);
    setCurrentIndex(0);
    message.success('Cards shuffled!');
  }, [cards.length]);

  const handleCategoryChange = useCallback((category: string | undefined) => {
    setSelectedCategory(category);
    setCurrentIndex(0);
    setShuffledIndices([]); // Reset shuffle when filtering
  }, []);

  const handleAddCardSuccess = useCallback(() => {
    setShowAddForm(false);
    setCurrentIndex(0);
    setShuffledIndices([]);
  }, []);

  const handleNavigateHome = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleNavigateAdmin = useCallback(() => {
    navigate('/admin');
  }, [navigate]);

  const handleShowAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  if (isLoading) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '16px', textAlign: 'center' }}>
          <Text>Đang tải...</Text>
        </Content>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Content style={{ padding: '16px' }}>
          <Card>
            <Text>Có lỗi xảy ra khi tải dữ liệu.</Text>
            <br />
            <Button onClick={() => globalThis.location.reload()} style={{ marginTop: '8px' }}>
              Tải lại
            </Button>
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
          padding: '0 16px',
        }}
      >
        <Space wrap>
          <Button icon={<HomeOutlined />} onClick={handleNavigateHome} type="text">
            <span className="ant-btn-text-hidden-sm">Học Từ Vựng</span>
          </Button>
          {isAdmin && (
            <Button type="primary" onClick={handleNavigateAdmin}>
              Quản trị
            </Button>
          )}
        </Space>
        <Space wrap align="center" size="middle">
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              maxWidth: 150,
              height: '32px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            <Text ellipsis style={{ margin: 0, lineHeight: '32px' }}>
              Xin chào, {user?.username}
            </Text>
          </span>
          <Button icon={<LogoutOutlined />} onClick={logout}>
            <span className="ant-btn-text-hidden-sm">Đăng xuất</span>
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '16px' }}>
        <Row justify="center">
          <Col xs={24} sm={24} md={20} lg={16} xl={14}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Card>
                <Space direction="vertical" size="large" style={{ width: '100%' }}>
                  <Row gutter={[16, 16]} align="middle">
                    <Col xs={24} sm={24} md={6}>
                      <Text strong>Lọc theo danh mục:</Text>
                    </Col>
                    <Col xs={24} sm={24} md={18}>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Tất cả danh mục"
                        allowClear
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        options={categories.map((cat) => ({ label: cat, value: cat }))}
                      />
                    </Col>
                  </Row>
                  <Row gutter={[8, 8]} justify="center" align="middle">
                    <Col>
                      <Button onClick={handlePrevious} disabled={cards.length === 0}>
                        Trước
                      </Button>
                    </Col>
                    <Col>
                      <Text strong style={{ lineHeight: '32px', display: 'inline-block' }}>
                        {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
                      </Text>
                    </Col>
                    <Col>
                      <Button onClick={handleNext} disabled={cards.length === 0}>
                        Sau
                      </Button>
                    </Col>
                    <Col>
                      <Button onClick={handleShuffle} disabled={cards.length === 0}>
                        Xáo trộn
                      </Button>
                    </Col>
                  </Row>
                </Space>
              </Card>

              {cards.length === 0 ? (
                <Card>
                  <Text style={{ textAlign: 'center', display: 'block', fontSize: '16px' }}>
                    {selectedCategory
                      ? 'Không có thẻ nào trong danh mục này.'
                      : 'Chưa có thẻ nào. Hãy thêm thẻ mới!'}
                  </Text>
                </Card>
              ) : currentCard ? (
                <FlipCard card={currentCard} />
              ) : null}
            </Space>
          </Col>
        </Row>

        {showAddForm && (
          <AddCardForm
            onClose={() => setShowAddForm(false)}
            onSuccess={handleAddCardSuccess}
          />
        )}

        <FloatButton
          icon={<PlusOutlined />}
          type="primary"
          tooltip="Thêm thẻ mới"
          onClick={handleShowAddForm}
          shape="circle"
          style={{ width: 64, height: 64 }}
        />
      </Content>
    </Layout>
  );
}
