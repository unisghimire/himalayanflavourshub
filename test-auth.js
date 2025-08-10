// Test script for Supabase Authentication
// Run this in your browser console after setting up Supabase auth

console.log('🧪 Testing Supabase Authentication...');

// Test 1: Check if Supabase client is working
try {
  console.log('✅ Supabase client loaded successfully');
  console.log('🔗 Supabase URL:', process.env.REACT_APP_SUPABASE_URL);
} catch (error) {
  console.error('❌ Supabase client error:', error);
}

// Test 2: Check authentication status
async function testAuthStatus() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      console.log('✅ User is authenticated');
      console.log('👤 User ID:', session.user.id);
      console.log('📧 User Email:', session.user.email);
      console.log('🔑 Session expires:', new Date(session.expires_at * 1000));
    } else {
      console.log('❌ User is not authenticated');
    }
  } catch (error) {
    console.error('❌ Auth status check failed:', error);
  }
}

// Test 3: Test sign in (replace with your admin credentials)
async function testSignIn(email, password) {
  try {
    console.log('🔐 Attempting sign in...');
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });
    
    if (error) {
      console.error('❌ Sign in failed:', error.message);
    } else {
      console.log('✅ Sign in successful!');
      console.log('👤 User:', data.user);
      console.log('🔑 Session:', data.session);
    }
  } catch (error) {
    console.error('❌ Sign in error:', error);
  }
}

// Test 4: Test sign out
async function testSignOut() {
  try {
    console.log('🚪 Signing out...');
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('❌ Sign out failed:', error.message);
    } else {
      console.log('✅ Sign out successful!');
    }
  } catch (error) {
    console.error('❌ Sign out error:', error);
  }
}

// Run tests
console.log('\n📋 Running authentication tests...\n');

// Check current auth status
testAuthStatus();

// Instructions for manual testing
console.log('\n📝 Manual Testing Instructions:');
console.log('1. Run testAuthStatus() to check current authentication');
console.log('2. Run testSignIn("your-email@example.com", "your-password") to test login');
console.log('3. Run testSignOut() to test logout');
console.log('4. Check the console for results');

console.log('\n🎯 Ready for testing!');
