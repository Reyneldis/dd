-- AlterTable
ALTER TABLE "products" ADD COLUMN "searchText" tsvector;

-- CreateIndex
CREATE INDEX "products_searchText_idx" ON "products" USING gin("searchText");

-- UpdateFunction
CREATE OR REPLACE FUNCTION update_products_search_text()
RETURNS TRIGGER AS $$
DECLARE
  category_name text;
BEGIN
  SELECT c."categoryName" INTO category_name
  FROM categories c
  WHERE c.id = NEW."categoryId";

  NEW."searchText" :=
    to_tsvector('spanish', COALESCE(NEW."productName", '')) ||
    to_tsvector('spanish', COALESCE(NEW.description, '')) ||
    to_tsvector('spanish', COALESCE(category_name, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER tsvectorupdate
BEFORE INSERT OR UPDATE ON "products"
FOR EACH ROW EXECUTE PROCEDURE update_products_search_text();