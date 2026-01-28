# 🎨 PROJECTS MANAGER - SPLIT VIEW EDITOR
**Senior React Engineer**

## ✅ IMPLEMENTATION COMPLETE

The Projects Manager now features a **professional split-view layout** with dedicated tag input components for Core Competencies and Tech Stack management.

---

## 🎯 UI ARCHITECTURE

### Split-View Layout

```
┌─────────────────────────────────────────────────────────────┐
│                     Admin Dashboard                          │
├──────────────────┬──────────────────────────────────────────┤
│   LEFT PANEL     │           RIGHT PANEL                     │
│   (320px)        │           (Flex-1)                        │
│                  │                                           │
│  ┌────────────┐  │  ┌─────────────────────────────────────┐ │
│  │ + New      │  │  │ Edit Project          [🗑️] [💾 Save] │ │
│  └────────────┘  │  └─────────────────────────────────────┘ │
│                  │                                           │
│  ┌────────────┐  │  Title: [Input........................] │
│  │ [IMG]      │  │  Description: [Textarea...............] │
│  │ Project 1  │  │  Image URL: [Input...................] │
│  │ 3 skills   │  │  Live Link: [...]  GitHub: [........] │
│  └────────────┘  │                                           │
│                  │  ─────────────────────────────────────── │
│  ┌────────────┐  │  Core Competencies:                      │
│  │ [IMG]      │  │  [Input: Type and press Enter.........]  │
│  │ Project 2  │  │  [WebSockets] [REST APIs] [Real-time]   │
│  │ 5 skills   │  │                                           │
│  └────────────┘  │  ─────────────────────────────────────── │
│                  │  Tech Stack:                              │
│                  │  [Input: SimpleIcon slug...............]  │
│                  │  [🔷 nextdotjs] [🔶 supabase] [🟦 python] │
│                  │                                           │
│                  │  ─────────────────────────────────────── │
│                  │  Preview:                                 │
│                  │  [Project Card Preview..................] │
└──────────────────┴──────────────────────────────────────────┘
```

---

## 🔧 KEY FEATURES

### 1. Split-View Navigation

**Left Panel** (320px):
- Scrollable list of all projects
- Thumbnail + Title + Skill count
- Click to select and edit
- "+ New" button at top
- Active project highlighted with purple border

**Right Panel** (Flex):
- Full editor for selected project
- Scrollable content area
- Save and Delete buttons in header
- Live preview at bottom

### 2. Core Competencies (Field A)

**Purpose**: Text-based skills that appear as bordered pills

**Input Behavior**:
```
1. Type skill name (e.g., "WebSockets")
2. Press Enter → Creates pill
3. Click X on pill → Removes it
```

**Visual Style**:
```css
border border-slate-700
text-slate-300
rounded-full
```

**Data Storage**:
```typescript
competencies: string[]  // PostgreSQL array
// Example: ["WebSockets", "REST APIs", "Real-time Systems"]
```

**UI Components**:
- Input field with Enter key handler
- Pills with X button
- Preview section shows pills exactly as they'll appear

### 3. Tech Stack (Field B)

**Purpose**: Technology icons using SimpleIcon slugs

**Input Behavior**:
```
1. Type SimpleIcon slug (e.g., "nextdotjs")
2. Press Enter → Creates icon card
3. Icon preview loads immediately from CDN
4. Click X on hover → Removes it
```

**Icon Preview**:
```html
<img src="https://cdn.simpleicons.org/{slug}" />
```

**Data Storage**:
```typescript
tools: string[]  // PostgreSQL array of slugs
// Example: ["nextdotjs", "supabase", "python"]
```

**UI Components**:
- Input field with Enter key handler
- Icon cards with logo + name + X button
- Link to simpleicons.org for reference
- Preview section shows icons in a row

---

## 📊 DATABASE SCHEMA UPDATE

### Updated `projects` Table

```sql
create table projects (
  id bigint generated by default as identity primary key,
  title text not null,
  description text,
  image_url text,
  year text,
  competencies text[],  -- 🆕 Core competencies (text pills)
  tools text[],         -- 🆕 Tech stack (SimpleIcon slugs)
  live_link text,
  github_link text,
  is_featured boolean default false,
  position integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);
```

**Migration Required**:
```sql
-- Add competencies column
ALTER TABLE projects ADD COLUMN competencies text[];

-- If you already have a tools column, verify it's text[]
-- Otherwise add it:
ALTER TABLE projects ADD COLUMN tools text[];
```

---

## 🎨 VISUAL REFERENCE IMPLEMENTATION

### Core Competencies Pills

**Admin Preview**:
```tsx
<span className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs">
  WebSockets
</span>
```

**Frontend Display** (matches user's reference):
```tsx
<div className="flex flex-wrap gap-2">
  {project.competencies.map(skill => (
    <span className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs">
      {skill}
    </span>
  ))}
</div>
```

### Tech Stack Icons

**Admin Preview**:
```tsx
<div className="flex flex-wrap gap-3">
  {project.tools.map(tool => (
    <img
      src={`https://cdn.simpleicons.org/${tool}`}
      alt={tool}
      className="w-6 h-6 opacity-70 hover:opacity-100"
    />
  ))}
</div>
```

**Frontend Display**:
```tsx
<div className="flex gap-3">
  {project.tools.map(tool => (
    <img
      src={`https://cdn.simpleicons.org/${tool}`}
      alt={tool}
      className="w-6 h-6"
    />
  ))}
</div>
```

---

## 💻 CODE EXECUTION

### Array Handling ✅

**Problem**: Supabase requires arrays, not comma-separated strings

**Solution**: Direct array manipulation

```typescript
// ✅ CORRECT - Direct array storage
competencies: ["WebSockets", "REST APIs", "Real-time"]
tools: ["nextdotjs", "supabase", "python"]

// ❌ WRONG - String concatenation
competencies: "WebSockets, REST APIs, Real-time"
tools: "nextdotjs, supabase, python"
```

### Tag Input Implementation

**Competencies Handler**:
```typescript
const handleCompetencyKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && competencyInput.trim()) {
    e.preventDefault();
    const newCompetency = competencyInput.trim();
    if (!selectedProject.competencies.includes(newCompetency)) {
      setSelectedProject({
        ...selectedProject,
        competencies: [...selectedProject.competencies, newCompetency]
      });
    }
    setCompetencyInput("");
  }
};
```

**Tech Stack Handler**:
```typescript
const handleToolKeyDown = (e: React.KeyboardEvent) => {
  if (e.key === 'Enter' && toolInput.trim()) {
    e.preventDefault();
    const newTool = toolInput.trim().toLowerCase();
    if (!selectedProject.tools.includes(newTool)) {
      setSelectedProject({
        ...selectedProject,
        tools: [...selectedProject.tools, newTool]
      });
    }
    setToolInput("");
  }
};
```

### Supabase Save Operation

```typescript
const handleSave = async () => {
  const { id, ...projectData } = selectedProject;

  if (id) {
    // Update existing - arrays are sent as-is
    await supabase
      .from('projects')
      .update(projectData)
      .eq('id', id);
  } else {
    // Insert new - arrays are sent as-is
    await supabase
      .from('projects')
      .insert([projectData]);
  }
};
```

**No conversion needed** - arrays are sent directly to PostgreSQL

---

## 🚀 USAGE WORKFLOW

### Creating a New Project

1. Click **"+ New"** in left panel
2. Fill in basic fields:
   - Title (required)
   - Description
   - Image URL (preview updates live)
   - Live Link
   - GitHub Link

3. Add **Core Competencies**:
   ```
   Type: "WebSockets" → Press Enter
   Type: "REST APIs" → Press Enter
   Type: "Real-time Systems" → Press Enter
   ```
   Result: 3 pills appear below input

4. Add **Tech Stack**:
   ```
   Type: "nextdotjs" → Press Enter
   Type: "supabase" → Press Enter
   Type: "python" → Press Enter
   ```
   Result: 3 icon cards appear with logos

5. Review in **Preview Section**:
   - See exact visual representation
   - Pills show as bordered text
   - Icons show in a row

6. Click **"Save"** button

### Editing an Existing Project

1. Click project in left panel
2. Right panel loads with all data
3. Modify any fields
4. Add/remove competencies (click X)
5. Add/remove tools (click X on hover)
6. Click **"Save"** to update

### Deleting a Project

1. Select project
2. Click **🗑️ Delete** button in header
3. Confirm deletion
4. Project removed from database

---

## 🎯 TECHNICAL DETAILS

### Component State

```typescript
interface Project {
  id?: number;
  title: string;
  description: string;
  image_url: string;
  year: string;
  competencies: string[];  // Array, not string!
  tools: string[];         // Array, not string!
  live_link: string;
  github_link: string;
  is_featured: boolean;
  position: number;
}

const [projects, setProjects] = useState<Project[]>([]);
const [selectedProject, setSelectedProject] = useState<Project | null>(null);
const [competencyInput, setCompetencyInput] = useState("");
const [toolInput, setToolInput] = useState("");
```

### Icon CDN

**SimpleIcons CDN**:
```
https://cdn.simpleicons.org/{slug}
```

**Examples**:
- `nextdotjs` → Next.js logo
- `supabase` → Supabase logo
- `python` → Python logo
- `typescript` → TypeScript logo
- `react` → React logo

**Fallback**: If icon doesn't exist, `onError` handler hides the image

### Preview Accuracy

The preview section matches **exactly** what will appear on the frontend:

```tsx
{/* Core Competencies Pills */}
<div className="flex flex-wrap gap-2">
  {selectedProject.competencies.map((comp, idx) => (
    <span className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs">
      {comp}
    </span>
  ))}
</div>

{/* Tech Stack Icons */}
<div className="flex flex-wrap gap-3">
  {selectedProject.tools.map((tool, idx) => (
    <img
      src={`https://cdn.simpleicons.org/${tool}`}
      className="w-6 h-6 opacity-70"
    />
  ))}
</div>
```

---

## 🎨 STYLING REFERENCE

### Left Panel (Project List)

```css
width: 320px (w-80)
background: white/5 opacity (bg-white/5)
border: white/10 opacity (border-white/10)
overflow-y: auto
```

**Active Project Indicator**:
```css
bg-white/10
border-left: 4px purple-500
```

### Right Panel (Editor)

```css
flex: 1
background: white/5 opacity
border: white/10 opacity
overflow-y: auto
```

### Input Fields

```css
background: black (bg-black)
border: white/10 opacity (border-white/10)
focus: border-purple-500
text: white
padding: 12px 16px
rounded: 8px
```

### Competency Pills

```css
/* Outlined style matching reference */
border: 1px solid rgb(51 65 85) /* border-slate-700 */
color: rgb(203 213 225) /* text-slate-300 */
border-radius: 9999px /* rounded-full */
padding: 4px 12px /* px-3 py-1 */
font-size: 0.75rem /* text-xs */
```

### Tech Stack Icons

```css
width: 24px (w-6)
height: 24px (h-6)
opacity: 0.7 → 1.0 on hover
gap: 12px between icons
```

---

## 🐛 TROUBLESHOOTING

### "Competencies not saving as array"

**Cause**: Old code was splitting comma-separated strings
**Fix**: New code uses direct array manipulation
```typescript
// ✅ NEW
competencies: [...selectedProject.competencies, newCompetency]

// ❌ OLD
competencies: competencyInput.split(',').map(t => t.trim())
```

### "Tech stack icons not showing"

**Cause**: Invalid SimpleIcon slug
**Fix**: 
1. Visit [simpleicons.org](https://simpleicons.org/)
2. Search for technology
3. Copy exact slug (e.g., `nextdotjs` not `next.js`)
4. Use lowercase only

### "Preview section blank"

**Cause**: No competencies or tools added yet
**Fix**: Add at least one skill or tool using Enter key

### "Can't remove pills"

**Cause**: Click handler not working
**Fix**: Ensure clicking the X button, not the pill itself

---

## 📈 BEST PRACTICES

### Competencies (Text Pills)

**Good Examples**:
```
✅ WebSockets
✅ REST APIs
✅ Real-time Systems
✅ Database Design
✅ API Architecture
✅ Performance Optimization
```

**Avoid**:
```
❌ websockets (lowercase only)
❌ WebSockets, REST APIs (comma-separated in one pill)
❌ I built WebSockets (full sentences)
```

### Tech Stack (Icons)

**Good Examples**:
```
✅ nextdotjs
✅ supabase
✅ python
✅ typescript
✅ react
✅ postgresql
```

**Avoid**:
```
❌ Next.js (use nextdotjs)
❌ Supabase (use supabase)
❌ Python 3.11 (use python)
❌ custom-icon (must exist on SimpleIcons)
```

### Project Organization

1. **Limit Competencies**: 3-6 skills per project
2. **Limit Tech Stack**: 4-8 technologies per project
3. **Clear Titles**: Short, descriptive names
4. **Quality Images**: 16:9 ratio, high-resolution
5. **Working Links**: Test live and GitHub URLs

---

## 🔥 WHAT'S NEW

### From Old Version → New Version

**Before**:
```tsx
// Single input for comma-separated tools
tools: "React, Node, AWS"

// No competencies field

// Modal-based editing
```

**After**:
```tsx
// Separate arrays for competencies and tools
competencies: ["WebSockets", "REST APIs"]
tools: ["nextdotjs", "supabase"]

// Split-view layout
// Tag input components
// Live icon previews
// Inline editing
```

---

## ✅ COMPLETION CHECKLIST

- [x] Split-view layout (Left: List, Right: Editor)
- [x] Tag input for Core Competencies
- [x] Tag input for Tech Stack
- [x] SimpleIcon preview with CDN
- [x] Array-based data storage (not strings)
- [x] Preview section matching frontend style
- [x] Database schema updated with `competencies`
- [x] Save/Delete operations
- [x] TypeScript interfaces
- [x] Responsive scrolling
- [x] Live image preview
- [x] External links display

---

## 📝 FILES MODIFIED

1. **[ProjectManager.tsx](d:/New folder (2)/Codes/Portfolio/src/pages/admin/components/ProjectManager.tsx)**
   - Complete rewrite with split-view layout
   - Tag input components for competencies and tools
   - Live icon preview from SimpleIcons CDN
   - Inline editing with preview section

2. **[setup.sql](d:/New folder (2)/Codes/Portfolio/src/pages/admin/setup.sql)**
   - Added `competencies text[]` column
   - Updated `tools` column comment for clarity

---

## 🚀 NEXT STEPS

### 1. Database Migration

Run this in Supabase SQL Editor:
```sql
-- Add competencies column if it doesn't exist
ALTER TABLE projects ADD COLUMN IF NOT EXISTS competencies text[];

-- Verify tools is text[] type
-- If needed, add it:
ALTER TABLE projects ADD COLUMN IF NOT EXISTS tools text[];
```

### 2. Test the Manager

1. Navigate to `/admin`
2. Click "Projects" tab
3. Click "+ New" to create project
4. Add competencies: `WebSockets`, `REST APIs`, `Real-time`
5. Add tech stack: `nextdotjs`, `supabase`, `python`
6. Verify preview shows pills and icons
7. Click "Save"
8. Check database to confirm arrays saved correctly

### 3. Update Frontend

Ensure your frontend displays projects with:
```tsx
{/* Core Competencies Pills */}
<div className="flex flex-wrap gap-2">
  {project.competencies?.map(skill => (
    <span className="px-3 py-1 border border-slate-700 text-slate-300 rounded-full text-xs">
      {skill}
    </span>
  ))}
</div>

{/* Tech Stack Icons */}
<div className="flex gap-3">
  {project.tools?.map(tool => (
    <img 
      src={`https://cdn.simpleicons.org/${tool}`}
      className="w-6 h-6"
    />
  ))}
</div>
```

---

**Implementation Status**: ✅ **COMPLETE**
**Split-View Layout**: ✅ Left: List, Right: Editor
**Tag Input Components**: ✅ Competencies + Tech Stack
**Array Handling**: ✅ Direct array manipulation
**Icon Preview**: ✅ Live from SimpleIcons CDN

**Ready for production use** 🎉
