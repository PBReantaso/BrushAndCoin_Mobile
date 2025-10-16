// Database configuration for PostgreSQL backend
class DatabaseConfig {
  // Environment-specific database configurations
  static const Map<String, dynamic> _configs = {
    'development': {
      'host': 'postgres',
      'port': 5433,
      'database': 'BCDB',
      'username': 'postgres',
      'password': 'BoboyAdmin_2025',
      'ssl': false,
    },
    'staging': {
      'host': 'staging-db.brushandcoin.com',
      'port': 5433,
      'database': 'brushandcoin_staging',
      'username': 'staging_user',
      'password': 'staging_password',
      'ssl': true,
    },
    'production': {
      'host': 'prod-db.brushandcoin.com',
      'port': 5433,
      'database': 'brushandcoin_prod',
      'username': 'prod_user',
      'password': 'prod_password',
      'ssl': true,
    },
  };

  // Get database configuration for current environment
  static Map<String, dynamic> getConfig() {
    const environment =
        String.fromEnvironment('ENVIRONMENT', defaultValue: 'development');
    return _configs[environment] ?? _configs['development']!;
  }

  // Connection string for PostgreSQL
  static String getConnectionString() {
    final config = getConfig();
    final sslMode = config['ssl'] ? 'require' : 'disable';

    return 'postgresql://${config['username']}:${config['password']}@${config['host']}:${config['port']}/${config['database']}?sslmode=$sslMode';
  }

  // Database schema version for migrations
  static const int currentSchemaVersion = 1;

  // Database tables structure
  static const Map<String, String> tables = {
    'users': '''
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(50) UNIQUE,
        bio TEXT,
        profile_image_url TEXT,
        user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('artist', 'client')),
        is_verified BOOLEAN DEFAULT FALSE,
        is_active BOOLEAN DEFAULT TRUE,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        location_address TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'artworks': '''
      CREATE TABLE IF NOT EXISTS artworks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        image_urls TEXT[],
        category VARCHAR(50),
        tags TEXT[],
        price DECIMAL(10, 2),
        is_commission BOOLEAN DEFAULT FALSE,
        is_available BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'commissions': '''
      CREATE TABLE IF NOT EXISTS commissions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        artist_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        budget DECIMAL(10, 2) NOT NULL,
        deadline DATE,
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'cancelled')),
        reference_images TEXT[],
        requirements TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'payments': '''
      CREATE TABLE IF NOT EXISTS payments (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        commission_id UUID NOT NULL REFERENCES commissions(id) ON DELETE CASCADE,
        amount DECIMAL(10, 2) NOT NULL,
        currency VARCHAR(3) DEFAULT 'PHP',
        payment_method VARCHAR(50) NOT NULL,
        payment_gateway VARCHAR(50) NOT NULL,
        gateway_transaction_id VARCHAR(255),
        status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded')),
        escrow_released_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'messages': '''
      CREATE TABLE IF NOT EXISTS messages (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        conversation_id UUID NOT NULL,
        sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'file')),
        attachment_url TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'reviews': '''
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        commission_id UUID REFERENCES commissions(id) ON DELETE SET NULL,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'events': '''
      CREATE TABLE IF NOT EXISTS events (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        organizer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date TIMESTAMP WITH TIME ZONE NOT NULL,
        location_lat DECIMAL(10, 8),
        location_lng DECIMAL(11, 8),
        location_address TEXT,
        max_attendees INTEGER,
        registration_fee DECIMAL(10, 2) DEFAULT 0,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    ''',
    'event_attendees': '''
      CREATE TABLE IF NOT EXISTS event_attendees (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        registered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(event_id, user_id)
      );
    ''',
  };

  // Indexes for better performance
  static const List<String> indexes = [
    'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);',
    'CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);',
    'CREATE INDEX IF NOT EXISTS idx_users_location ON users(location_lat, location_lng);',
    'CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks(user_id);',
    'CREATE INDEX IF NOT EXISTS idx_artworks_category ON artworks(category);',
    'CREATE INDEX IF NOT EXISTS idx_commissions_client_id ON commissions(client_id);',
    'CREATE INDEX IF NOT EXISTS idx_commissions_artist_id ON commissions(artist_id);',
    'CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);',
    'CREATE INDEX IF NOT EXISTS idx_payments_commission_id ON payments(commission_id);',
    'CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);',
    'CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);',
    'CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);',
    'CREATE INDEX IF NOT EXISTS idx_reviews_reviewee_id ON reviews(reviewee_id);',
    'CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);',
    'CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);',
    'CREATE INDEX IF NOT EXISTS idx_event_attendees_event_id ON event_attendees(event_id);',
  ];
}
