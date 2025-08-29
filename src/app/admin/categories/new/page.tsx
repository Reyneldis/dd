'use client';

import { CategoryForm } from "../components/category-form";

// This page now uses the single, unified CategoryForm component.
// It passes initialData={null} to signify that this is for creating a new category.
const CreateCategoryPage = () => {
  return <CategoryForm initialData={null} />;
};

export default CreateCategoryPage;
