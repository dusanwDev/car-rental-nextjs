# 🔍 Troubleshoot 400 Error - RLS Policies OK

Your RLS policies are correctly set up, so the 400 error is likely due to one of these issues:

## 🎯 **Most Likely Causes:**

### 1. **Data Type Mismatch**
- Your `images` field might be causing issues
- The `user_id` format might be wrong
- Column constraints might be violated

### 2. **Missing Required Fields**
- Some columns might be NOT NULL but missing
- Check if `id` column has proper default value

### 3. **Array Format Issue**
- `images` field expects PostgreSQL array format

## 🧪 **Debug Steps:**

### Step 1: Test Direct SQL Insert
In your **Supabase SQL Editor**, try this exact query:

```sql
INSERT INTO public.properties (
    price, city, country, area, bedrooms, bathrooms, 
    type, title, description, images, user_id
) VALUES (
    20000, 
    'Belgrade', 
    'Serbia', 
    50, 
    1, 
    2,
    'House', 
    'Comfy House', 
    'Comfy house in Belgrade', 
    ARRAY['0.9849148880145047.jpg'], 
    '34daf33e-2c57-42e0-a358-5f0bb90017bc'::uuid
);
```

**If this fails**, it will show you the exact error.

### Step 2: Check Column Constraints
In Supabase Dashboard:
1. Go to **Database** → **Tables** → **properties**
2. Check **Schema** tab
3. Look for:
   - NOT NULL constraints
   - DEFAULT values
   - CHECK constraints
   - Data types

### Step 3: Simplify the API Request
Try with minimal required fields only:

```json
{
    "price": 20000,
    "city": "Belgrade",
    "country": "Serbia",
    "area": 50,
    "bedrooms": 1,
    "bathrooms": 2,
    "type": "House",
    "user_id": "34daf33e-2c57-42e0-a358-5f0bb90017bc"
}
```

### Step 4: Check Browser Network Tab
1. Open **Browser DevTools** (F12)
2. Go to **Network** tab
3. Try the API request
4. Click on the failed request
5. Check **Response** tab for detailed error message

## 🔧 **Common Fixes:**

### Fix 1: Images Array Format
If images is the issue, try:
```json
{
    "images": "{\"0.9849148880145047.jpg\"}"
}
```
or
```json
{
    "images": null
}
```

### Fix 2: User ID Format
Make sure user_id is a valid UUID:
```json
{
    "user_id": "34daf33e-2c57-42e0-a358-5f0bb90017bc"
}
```

### Fix 3: Remove Optional Fields
Try without title, description, images first:
```json
{
    "price": 20000,
    "city": "Belgrade",
    "country": "Serbia", 
    "area": 50,
    "bedrooms": 1,
    "bathrooms": 2,
    "type": "House",
    "user_id": "34daf33e-2c57-42e0-a358-5f0bb90017bc"
}
```

## 🚨 **Next Steps:**

1. **Try the SQL insert above** - this will reveal the exact error
2. **Check the detailed error message** in browser Network tab
3. **Test with simplified data** to isolate the problem

Can you try the SQL insert in Supabase and tell me what error you get?

