# Supabase Table Setup Guide

## 🗄️ Recommended Table Structure

Based on your BoostlyAI application, here are the essential tables you should have:

### 1. **profiles** Table
**Purpose**: Store user profile information
```sql
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT,
    last_name TEXT,
    full_name TEXT,
    avatar_url TEXT,
    website TEXT,
    bio TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. **websites** Table
**Purpose**: Store AI-generated websites
```sql
CREATE TABLE websites (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    html_content TEXT NOT NULL,
    css_content TEXT NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. **ai_insights** Table
**Purpose**: Store AI-generated business insights
```sql
CREATE TABLE ai_insights (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    business_description TEXT NOT NULL,
    competitors TEXT,
    seo_analysis TEXT,
    pros_cons TEXT,
    market_relevance TEXT,
    future_score TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4. **email_campaigns** Table
**Purpose**: Store email marketing campaigns
```sql
CREATE TABLE email_campaigns (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    subject TEXT NOT NULL,
    content TEXT NOT NULL,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'sent')),
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 5. **user_settings** Table
**Purpose**: Store user preferences
```sql
CREATE TABLE user_settings (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 🔧 Setup Steps

### Step 1: Create Tables
1. Go to your Supabase dashboard
2. Navigate to **Table Editor**
3. Click **"New Table"** for each table above
4. Use the SQL structure provided above

### Step 2: Enable Row Level Security (RLS)
For each table, enable RLS:
```sql
ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;
```

### Step 3: Create RLS Policies
Add these policies to each table:

**For profiles table:**
```sql
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = id);
```

**For websites table:**
```sql
CREATE POLICY "Users can view own websites" ON websites
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own websites" ON websites
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own websites" ON websites
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own websites" ON websites
    FOR DELETE USING (auth.uid() = user_id);
```

### Step 4: Create Indexes
Add performance indexes:
```sql
CREATE INDEX idx_websites_user_id ON websites(user_id);
CREATE INDEX idx_websites_created_at ON websites(created_at);
CREATE INDEX idx_ai_insights_user_id ON ai_insights(user_id);
```

### Step 5: Create Triggers
Add automatic profile creation:
```sql
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, email, first_name, last_name, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'first_name',
        NEW.raw_user_meta_data->>'last_name',
        NEW.raw_user_meta_data->>'name'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

## 📊 Sample Data to Add

### Test User Profile
```sql
INSERT INTO profiles (id, email, first_name, last_name, full_name) 
VALUES (
    'your-user-id-here',
    'test@example.com',
    'John',
    'Doe',
    'John Doe'
);
```

### Test Website
```sql
INSERT INTO websites (user_id, title, description, html_content, css_content) 
VALUES (
    'your-user-id-here',
    'My Test Website',
    'A sample website generated by AI',
    '<div>Hello World</div>',
    'body { font-family: Arial; }'
);
```

### Test AI Insight
```sql
INSERT INTO ai_insights (user_id, business_description, competitors, seo_analysis, pros_cons, market_relevance, future_score) 
VALUES (
    'your-user-id-here',
    'A bakery business',
    'Local bakeries, supermarkets',
    'Good local SEO potential',
    'Pros: High demand, Cons: Competition',
    'Growing market for artisanal products',
    '8/10 - Strong potential'
);
```

## 🧪 Testing Your Tables

1. **Create a user account** in your app
2. **Check the profiles table** - should auto-create a profile
3. **Generate a website** - should save to websites table
4. **Create AI insights** - should save to ai_insights table

## 🔍 Common Issues

- **"Table doesn't exist"**: Make sure you created the table with exact names
- **"Permission denied"**: Enable RLS and add proper policies
- **"Foreign key constraint"**: Make sure user_id references valid auth.users

Let me know which tables you created and I can help you set them up properly! 