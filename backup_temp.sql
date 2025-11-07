--
-- PostgreSQL database dump
--

\restrict vh1iYyoYKAYdEAAh507PtOYla2kDB70LzgrZPEuNzoDGz874aqCQ4VKqkppsVYm

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.6

-- Started on 2025-10-25 13:55:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 4960 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- TOC entry 859 (class 1247 OID 16389)
-- Name: AddressType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddressType" AS ENUM (
    'HOME',
    'WORK',
    'OTHER'
);


ALTER TYPE public."AddressType" OWNER TO postgres;

--
-- TOC entry 862 (class 1247 OID 16396)
-- Name: OrderStatus; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."OrderStatus" AS ENUM (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
    'REFUNDED',
    'FAILED'
);


ALTER TYPE public."OrderStatus" OWNER TO postgres;

--
-- TOC entry 865 (class 1247 OID 16414)
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- TOC entry 868 (class 1247 OID 16422)
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."Status" OWNER TO postgres;

--
-- TOC entry 230 (class 1255 OID 16427)
-- Name: update_products_search_text(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_products_search_text() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
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
$$;


ALTER FUNCTION public.update_products_search_text() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16434)
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16441)
-- Name: cart_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cart_items (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.cart_items OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16448)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id text NOT NULL,
    "categoryName" text NOT NULL,
    slug text NOT NULL,
    "mainImage" text,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16454)
-- Name: contact_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_info (
    id text NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    phone text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "orderId" text NOT NULL
);


ALTER TABLE public.contact_info OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 17598)
-- Name: email_metrics; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.email_metrics (
    id text NOT NULL,
    "timestamp" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    type text NOT NULL,
    recipient text NOT NULL,
    "orderId" text NOT NULL,
    status text NOT NULL,
    attempt integer NOT NULL,
    error text
);


ALTER TABLE public.email_metrics OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 16460)
-- Name: order_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.order_items (
    id text NOT NULL,
    "orderId" text NOT NULL,
    "productId" text NOT NULL,
    "productName" text,
    "productSku" text,
    price double precision NOT NULL,
    quantity integer NOT NULL,
    total double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.order_items OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16466)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "customerEmail" text,
    subtotal double precision NOT NULL,
    "taxAmount" double precision DEFAULT 0 NOT NULL,
    "shippingAmount" double precision DEFAULT 0 NOT NULL,
    total double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 223 (class 1259 OID 16475)
-- Name: product_images; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.product_images (
    id text NOT NULL,
    "productId" text NOT NULL,
    url text NOT NULL,
    alt text,
    "sortOrder" integer DEFAULT 0 NOT NULL,
    "isPrimary" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.product_images OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16483)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id text NOT NULL,
    slug text NOT NULL,
    "productName" text NOT NULL,
    price double precision NOT NULL,
    description text,
    "categoryId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    featured boolean DEFAULT false NOT NULL,
    features text[],
    status public."Status" DEFAULT 'ACTIVE'::public."Status" NOT NULL,
    stock smallint DEFAULT 0 NOT NULL,
    "searchText" tsvector
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 225 (class 1259 OID 16492)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id text NOT NULL,
    "userId" text NOT NULL,
    "productId" text NOT NULL,
    rating integer NOT NULL,
    comment text,
    "isApproved" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16499)
-- Name: shipping_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shipping_addresses (
    id text NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    zip text NOT NULL,
    country text DEFAULT 'Cuba'::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "orderId" text NOT NULL
);


ALTER TABLE public.shipping_addresses OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16506)
-- Name: user_addresses; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_addresses (
    id text NOT NULL,
    type public."AddressType" DEFAULT 'HOME'::public."AddressType" NOT NULL,
    street text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    "zipCode" text NOT NULL,
    country text DEFAULT 'Colombia'::text NOT NULL,
    "isDefault" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public.user_addresses OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16515)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id text NOT NULL,
    "clerkId" text NOT NULL,
    email text NOT NULL,
    "firstName" text,
    "lastName" text,
    avatar text,
    role public."Role" DEFAULT 'USER'::public."Role" NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 4942 (class 0 OID 16434)
-- Dependencies: 217
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
9a646d43-a163-43a4-8eeb-844358826445	5da1e0bce0ead8cae5bd749273604add18846cbbd24c39b05fb0a7341d9e114a	2025-08-14 08:19:44.026464+02	20250706235913_init	\N	\N	2025-08-14 08:19:44.007254+02	1
360c8f7c-656d-4a01-9e25-9dac37edcdd6	fe8092a8fb0496f67b1ec613f31cd438ba81ed06fec96ebda3c8f77ef22efd26	2025-08-14 08:19:45.675386+02	20250809160923_add_stock_to_products	\N	\N	2025-08-14 08:19:45.671683+02	1
7acffa32-4c20-4606-a874-f26fc34d9770	79b13aae1ad344820b811c8404d71ade9a2d961679121b9027389e98caecb173	2025-08-14 08:19:44.550886+02	20250707004934_simplified_schema	\N	\N	2025-08-14 08:19:44.027702+02	1
8717ff15-f910-4330-99dd-021964b8813a	ab777e6757ebdf647fb56aa9888e8c2db2bf31356e2a0a2fe0847c4ef28ca174	2025-08-14 08:19:44.557623+02	20250707054705_add_user_is_active	\N	\N	2025-08-14 08:19:44.552768+02	1
8c1abdf6-1958-4463-8859-77bc164f7402	d64345fd34a4184045f85fcc54cc973375cb58df115cd421d86e3c3871af7edf	2025-08-14 08:19:44.563599+02	20250708061235_add_product_status	\N	\N	2025-08-14 08:19:44.558952+02	1
2902c14d-1dba-4398-baeb-6efb9b37ca79	a4bb9f5d98a6cc9bba897e2dbbee7fecf2aa313711511cda81e36c46235af2a4	2025-08-14 08:19:45.682079+02	20250811104515_removed_review_uniqueness	\N	\N	2025-08-14 08:19:45.676346+02	1
951e703a-c35e-4a4d-839d-fa4f9d17eb91	d95dfa107662e7fbee7a53293d52cb8b6fc30838d3b42ba77f21048277c31577	2025-08-14 08:19:44.572663+02	20250713121744_add_featured_to_product	\N	\N	2025-08-14 08:19:44.564895+02	1
ff16e9da-f728-49ad-b0f5-74499a4d259c	54e582a306878775b19b6217a1733b7b5121fccd0c5340535a8facb6b214fa97	2025-08-14 08:19:44.593704+02	20250714153707_nuevo	\N	\N	2025-08-14 08:19:44.573988+02	1
7ee5d3f5-efcf-4293-8b1b-cf9b4f00b3d2	d6f3fb6d5a33eab721bb1ce58840cb14c42184ab405fb4534da1c6ac587793f6	2025-08-14 08:19:44.642047+02	20250716044228_add_payment_intent_id_to_order_optional	\N	\N	2025-08-14 08:19:44.595087+02	1
837454a3-b610-4d73-bc73-37e7a73f8bd6	339c1f46d8b4f8ac2d2ebecac88b6b43b2d63cd77a3566c9b056028563af4a4a	2025-08-14 08:19:45.705175+02	20250813041352_nueva	\N	\N	2025-08-14 08:19:45.684787+02	1
374f0f92-5ceb-4944-b310-f24ecd7c8ab0	f44eb33d4f6d64e97c250845eaed59c6ced616831f6b5ae6d8f77db7e0fe8fae	2025-08-14 08:19:44.648032+02	20250716063710_add_shipping_billing_address_to_order	\N	\N	2025-08-14 08:19:44.643444+02	1
bc527b74-aad5-42ef-87c8-e9f8c83ae631	164bdcdaaa248096bea91139e4e8deb23af0b678468a248f1147ceb63a415484	2025-08-14 08:19:44.655345+02	20250717053730_add_failed_to_order_status	\N	\N	2025-08-14 08:19:44.650643+02	1
7e05617f-fba3-402d-b42c-a495bf4eff8d	9743dcdaa7d078fc5e2a497dda891502adce26e6e1a3cc795ba385364c61f20a	2025-08-14 08:19:45.250789+02	20250721002457_fix_archived_orders	\N	\N	2025-08-14 08:19:44.656915+02	1
faba4d1e-2f81-4604-ba37-e70a87d3a30c	a32c7ffc31a87e56f9f7a3076abdc4179e475d8869fa44958a03022d76b70052	2025-08-14 08:19:45.730143+02	20250814180000_add_fulltext_search	\N	\N	2025-08-14 08:19:45.706305+02	1
c93bd9d2-2b65-4f1a-a3ce-d46227648a48	7b8b4ca3bb86e6858100d6b6a73a2af9350521665bed50e6b9792d2c25dc1862	2025-08-14 08:19:45.285164+02	20250729120322_add_indexes	\N	\N	2025-08-14 08:19:45.251862+02	1
adf5f71f-6ebe-4eef-b2e4-23434593fbcd	f7cf124377c13624a372be7e72d63abd1cf8692efc031e5740d1c244930016fd	2025-08-14 08:19:45.62994+02	20250805224439_add_optional_user_id_to_orders	\N	\N	2025-08-14 08:19:45.286319+02	1
2b7b453c-affb-4582-84e5-f708cc2e8228	c5c8ab91665829cb62be82af2da760323177d2f55ad4f06ad000a0b52d0fa92c	2025-08-14 08:19:45.670597+02	20250809153146_add_customer_email_to_order	\N	\N	2025-08-14 08:19:45.631864+02	1
1581f033-2570-457a-b25c-10e934f5028e	ec76d23ad48d749d6174205d9e2890e7d50cd9ce5c36fe3674810db3b92320d0	2025-09-19 22:11:06.258469+02	20250919201105_add_email_metrics	\N	\N	2025-09-19 22:11:05.74597+02	1
\.


--
-- TOC entry 4943 (class 0 OID 16441)
-- Dependencies: 218
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
cmge2jxms000bcjkc0t0qhbo6	cmeb0nzvp0000wa7g3if2r6a6	cmefwrem90004wa9go1wrjxgv	1	2025-10-05 19:02:23.236	2025-10-05 19:02:23.236
cmghw26td0003cjic24qsksq6	cmeb0nzvp0000wa7g3if2r6a6	cmfn1d6660005trr8jnbo5zkr	3	2025-10-08 11:11:42.338	2025-10-08 11:50:48.178
cmf5o0gij0001waggvtd0spdq	cmeb0nzvp0000wa7g3if2r6a6	cmei22dkr000jwaewiy53rskc	5	2025-09-04 17:13:28.21	2025-10-08 11:59:34.511
cmgi0601x0001cjjoocdfm17l	cmeb0nzvp0000wa7g3if2r6a6	cmfmz0tqu001atric14quaazt	1	2025-10-08 13:06:38.17	2025-10-08 13:06:38.17
cmge2bgsq0007cjkcoogt5f8w	cmeb0nzvp0000wa7g3if2r6a6	cmfmwxrje0015tricgzilvp56	3	2025-10-05 18:55:48.171	2025-10-08 13:06:41.543
cmghvsyrt0001cjic3ba9mbyc	cmeb0nzvp0000wa7g3if2r6a6	cmfo6kyds0003trxcwxl7dzcz	7	2025-10-08 11:04:31.895	2025-10-08 13:33:34.649
cmge2e89q0009cjkc47h1ciof	cmeb0nzvp0000wa7g3if2r6a6	cmeh25lbq0001wakcul5ur38t	5	2025-10-05 18:57:57.086	2025-10-08 13:45:55.119
cmge2mg9j000dcjkcjj9vqa2v	cmeb0nzvp0000wa7g3if2r6a6	cmf5m0zrq0001wa7kjgyjpbo4	4	2025-10-05 19:04:20.696	2025-10-08 14:05:52.782
cmge2rjo2000fcjkc15fyxmbd	cmeb0nzvp0000wa7g3if2r6a6	cmei20ojf000gwaewgpd70ap0	11	2025-10-05 19:08:18.387	2025-10-08 14:56:37.288
\.


--
-- TOC entry 4944 (class 0 OID 16448)
-- Dependencies: 219
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, "categoryName", slug, "mainImage", description, "createdAt", "updatedAt") FROM stdin;
cmeb173vw0001walc7x6k581f	Comida	comida	/uploads/general/6ad6c4ca-a7e8-4351-9f67-1e57191c5f93.webp	Alimentos para tu hogar	2025-08-14 06:41:41.997	2025-08-28 23:09:52.886
cmefucl7m0000wa3smr9pytdf	Electrodomésticos	electrodomesticos	/uploads/general/935e193f-3f63-4630-9f2c-c6f62eefd85a.webp	Equipos electrodomésticos	2025-08-17 15:28:51.292	2025-08-28 23:10:16.4
cmefspwho0000waj8cqv2x3pl	Aseos	aseos	/uploads/general/af7428ac-0308-4d44-8670-7a17570a926a.webp	Productos de aseos para tu hogar	2025-08-17 14:43:13.199	2025-08-28 23:10:40.296
\.


--
-- TOC entry 4945 (class 0 OID 16454)
-- Dependencies: 220
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.contact_info (id, name, email, phone, "createdAt", "updatedAt", "orderId") FROM stdin;
cmeb2hrlt000dwa9cvb8m9u2z	umpierre	reyneldis537@gmail.com	059597421	2025-08-14 07:17:58.907	2025-08-14 07:17:58.907	cmeb2hrlt000cwa9c1zvs9qk9
cmehzyb640002waycqt1zoda7	Reynldis	reyneldis537@gmail.com	059597421	2025-08-19 03:41:15.147	2025-08-19 03:41:15.147	cmehzyb640001waycw8lm8cc2
cmei0pc4u0002waewlhnea5y4	Reynldis	reyneldis537@gmail.com	3001234567	2025-08-19 04:02:16.109	2025-08-19 04:02:16.109	cmei0pc4u0001waewyswn0w89
cmei2c89j000pwaew8vxe3nw8	umpierre	reyneldis537@gmail.com	059597421	2025-08-19 04:48:03.796	2025-08-19 04:48:03.796	cmei2c89i000owaewq9zsxko0
cmeiiopc40002waro32j7pv1l	Pérez	elizabeth@gmail.com	3001234567	2025-08-19 12:25:39.652	2025-08-19 12:25:39.652	cmeiiopc40001warogrlsnbvk
cmekj4zw30002wa90u0pmhnua	Pérez	reyneldis537@gmail.com	3001234567	2025-08-20 22:13:52.174	2025-08-20 22:13:52.174	cmekj4zw30001wa9051mmttqv
cmekjw13r0009wa90chn7j7e4	Ana 	reyneldis537@gmail.com	059597428	2025-08-20 22:34:53.462	2025-08-20 22:34:53.462	cmekjw13r0008wa90ta57x0kv
cmeln52470002wam08le8qybl	umpierre	reyneldis537@gmail.com	059597421	2025-08-21 16:53:39.702	2025-08-21 16:53:39.702	cmeln52470001wam0e6m16zrq
cmemjo6890002watk3tw7htf5	Reynldis	reyneldis537@gmail.com	059597421	2025-08-22 08:04:19.204	2025-08-22 08:04:19.204	cmemjo6880001watkoj8ut6n5
cmf5o0gkw0004wagg8al9h126	umpierre	neldis537@gmail.com	3001234567	2025-09-04 17:13:28.303	2025-09-04 17:13:28.303	cmf5o0gkw0003waggyb5mvoof
cmf5o8a40000bwagg82ol9462	Pérez	reyneldis537@gmail.com	3001234567	2025-09-04 17:19:33.168	2025-09-04 17:19:33.168	cmf5o8a3z000awaggdtyb75tk
cmf5ogfkk0002waq4v7wby1mt	umpierre	reyneldis537@gmail.com	3001234567	2025-09-04 17:25:53.492	2025-09-04 17:25:53.492	cmf5ogfkk0001waq4z5nc56yu
cmf6t03yx0002wal46n0nbm1a	umpierre	reyneldis537@gmail.com	059597421	2025-09-05 12:20:56.209	2025-09-05 12:20:56.209	cmf6t03yw0001wal4czps50a7
cmf6vi2u60002wabgsbfv5i9g	umpierre	reyneldis537@gmail.com	059597421	2025-09-05 13:30:53.784	2025-09-05 13:30:53.784	cmf6vi2u40001wabgz9yl5zaj
cmf6wtq6s000bwabgy4oz0khf	umpierre	reyneldis537@gmail.com	059597421	2025-09-05 14:07:56.878	2025-09-05 14:07:56.878	cmf6wtq6s000awabg37g6dd4e
cmf9aqb7r0002wayw844kcqr4	umpierre	neldis537@gmail.com	3001234567	2025-09-07 06:12:44.479	2025-09-07 06:12:44.479	cmf9aqb7q0001wayw0g484lfo
cmf9b5o7s0002wa5wr1ygsowz	umpierre	neldis537@gmail.com	3001234567	2025-09-07 06:24:41.169	2025-09-07 06:24:41.169	cmf9b5o7r0001wa5wizota04d
cmfbdneke0002wa5wda7jjna9	umpierre	neldis537@gmail.com	3001234567	2025-09-08 17:10:00.056	2025-09-08 17:10:00.056	cmfbdneke0001wa5wfdcgnthi
cmfbgba3k0002waw01ipauxe0	umpierre	neldis537@gmail.com	3001234567	2025-09-08 18:24:33.242	2025-09-08 18:24:33.242	cmfbgba3k0001waw0t5d1podz
cmfbnymmv0002wa6opzihfb0w	umpierre	neldis537@gmail.com	3001234567	2025-09-08 21:58:39.889	2025-09-08 21:58:39.889	cmfbnymmu0001wa6o44brtbd7
cmfdc07cb0002wa4strwr6ysh	umpierre	neldis537@gmail.com	3001234567	2025-09-10 01:59:30.341	2025-09-10 01:59:30.341	cmfdc07cb0001wa4ssfeqjkgl
cmfdd18el000hwa4sxklh599e	umpierre	neldis537@gmail.com	3001234567	2025-09-10 02:28:17.997	2025-09-10 02:28:17.997	cmfdd18el000gwa4shywc2uaw
cmfddcj5l000wwa4s3ar3x3g5	umpierre	reyneldis537@gmail.com	059597421	2025-09-10 02:37:05.145	2025-09-10 02:37:05.145	cmfddcj5l000vwa4s5ckur8nx
cmfdf36u3001bwa4sbn2bng2f	umpierre	reyneldis@gamil.com	59597421	2025-09-10 03:25:48.505	2025-09-10 03:25:48.505	cmfdf36u3001awa4smijlvoet
cmfr9kytk0002traot2cu6vux	Umpierre	reyneldis537@gmail.com	059597428	2025-09-19 20:00:26.692	2025-09-19 20:00:26.692	cmfr9kytk0001traoo7epylud
cmfr9olwk0009trao5s9mxn3g	Umpierre	neldis537@gmail.com	059597422	2025-09-19 20:03:16.58	2025-09-19 20:03:16.58	cmfr9olwk0008traobwzs8faz
cmfra1a9r000gtraoxrbcz975	umpierre	reyneldis537@gmail.com	059597421	2025-09-19 20:13:07.951	2025-09-19 20:13:07.951	cmfra1a9o000ftraoxgvqwgym
cmfradhmu000qtraoi95uiwul	umpierre	neldis537@gmail.com	3001234567	2025-09-19 20:22:37.443	2025-09-19 20:22:37.443	cmfradhmu000ptraobhienzws
cmfraq2rq0010traokafgrm60	Pérez	reyneldis537@gmail.com	3001234567	2025-09-19 20:32:24.71	2025-09-19 20:32:24.71	cmfraq2rq000ztraoq2stn73l
cmfrb1e570019traoyd4mohnd	Umpierre	neldis537@gmail.com	059597428	2025-09-19 20:41:12.66	2025-09-19 20:41:12.66	cmfrb1e570018trao7im015l7
cmfrbej6c0002troka40eey9m	Umpierre	neldis537@gmail.com	059597427	2025-09-19 20:51:25.71	2025-09-19 20:51:25.71	cmfrbej6b0001trokkp07o8ts
cmfsda8lh0002truge2ox0kex	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597428	2025-09-20 14:31:50.777	2025-09-20 14:31:50.777	cmfsda8lg0001trugdw9pj79v
cmfyn9g1i0002cjash14jk9dk	Umpierre	reyneldis537@gmail.com	059597428	2025-09-24 23:57:46.98	2025-09-24 23:57:46.98	cmfyn9g1i0001cjasutfnha24
cmfyomjje000jcjas8ipq4mrx	umpierre	reyneldis537@gmail.com	059597428	2025-09-25 00:35:57.657	2025-09-25 00:35:57.657	cmfyomjje000icjasunch1rzy
cmfypxiz30002cjng0x4x7lkq	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597426	2025-09-25 01:12:29.762	2025-09-25 01:12:29.762	cmfypxiz20001cjngt65vb8ce
cmfyrmjy80002cjhc88zb3v7q	Pérez	reyneldis537@gmail.com	059597427	2025-09-25 01:59:57.05	2025-09-25 01:59:57.05	cmfyrmjy70001cjhc2we0dxx1
cmfys666k0002cjp41md85vy9	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597426	2025-09-25 02:15:12.321	2025-09-25 02:15:12.321	cmfys666j0001cjp41hok8xwq
cmfyszg5q000hcjp4ngbntgt9	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597422	2025-09-25 02:37:58.095	2025-09-25 02:37:58.095	cmfyszg5e000gcjp4gyglhujo
cmfytde9d000wcjp4xford9zl	dfsfgg	maykolperez93@gmail.com	059597421	2025-09-25 02:48:48.985	2025-09-25 02:48:48.985	cmfytde9b000vcjp41htcaalj
cmfytmoqn001ccjp41fklntmv	Umpierre	reyneldis537@gmail.com	059597426	2025-09-25 02:56:02.495	2025-09-25 02:56:02.495	cmfytmoqn001bcjp4pi7inq3c
cmfzfvvaw0002cjt47ssy5pd9	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597426	2025-09-25 13:19:02.446	2025-09-25 13:19:02.446	cmfzfvvav0001cjt42pleqynm
cmfzgh2d80002cjq83mwp2ahx	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597428	2025-09-25 13:35:31.384	2025-09-25 13:35:31.384	cmfzgh2d80001cjq8ei9nw8zo
cmfzh5ayb0002cjc0oacj2quv	umpierre	reyneldis537@gmail.com	059597427	2025-09-25 13:54:22.253	2025-09-25 13:54:22.253	cmfzh5ayb0001cjc0hwl8r6gb
cmg0y1am70002cjjk6z6n2dtl	Umpierre	reyneldis537@gmail.com	3001234567	2025-09-26 14:34:54.842	2025-09-26 14:34:54.842	cmg0y1am60001cjjkxs0fu3g7
cmg0y83j6000hcjjk0kvcupxb	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597428	2025-09-26 14:40:12.249	2025-09-26 14:40:12.249	cmg0y83j6000gcjjkqmvq9qy7
cmg0z7ia8000wcjjkus2qhsfl	umpierre	reyneldis@gamil.com	059597421	2025-09-26 15:07:44.322	2025-09-26 15:07:44.322	cmg0z7ia8000vcjjkr13b32oc
cmg10hgxj001bcjjk376buwfb	Pérez	reyneldis537@gmail.com	059597426	2025-09-26 15:43:28.748	2025-09-26 15:43:28.748	cmg10hgxh001acjjk35emoyua
cmg163mji0002cjksp9n1p2j1	Reynldiseeeeeeeee	reyneldis537@gmail.com	059597426	2025-09-26 18:20:40.535	2025-09-26 18:20:40.535	cmg163mji0001cjksbn93u05t
cmg5u9jio0002cjg0ep7mer9x	Reynldiseeeeeeeee	neldis537@gmail.com	59597421	2025-09-30 00:48:12.042	2025-09-30 00:48:12.042	cmg5u9jio0001cjg0tz3fxht3
cmgloz9yv0002cjgobfzeqpow	Reynldiseeeeeeeee	neldis537@gmail.com	3001234567	2025-10-11 03:04:33.834	2025-10-11 03:04:33.834	cmgloz9yt0001cjgoxvwcb0h0
cmglxvmbe0002cjmwelv59v1y	taleidy	neldis537@gmail.com	3001234567	2025-10-11 07:13:39.708	2025-10-11 07:13:39.708	cmglxvmbe0001cjmwaax5e6d9
cmgndtvmv000acjmwgu7md13a	Leudasas	neldis537@gmail.com	3001234567	2025-10-12 07:27:58.552	2025-10-12 07:27:58.552	cmgndtvmu0009cjmwwps07pzc
cmgndy4w0000hcjmwol97ltrz	Reynldiseeeeeeeee	neldis537@gmail.com	3001234567	2025-10-12 07:31:17.184	2025-10-12 07:31:17.184	cmgndy4w0000gcjmwg8r42gaj
cmgp53mes0002cj3c100okjxv	Reynldiseeeeeeeee	neldis537@gmail.com	3001234567	2025-10-13 12:59:08.976	2025-10-13 12:59:08.976	cmgp53mes0001cj3c8vyc2d9j
\.


--
-- TOC entry 4954 (class 0 OID 17598)
-- Dependencies: 229
-- Data for Name: email_metrics; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.email_metrics (id, "timestamp", type, recipient, "orderId", status, attempt, error) FROM stdin;
cmfra1jqj000ntrao1iym78oj	2025-09-19 20:13:19.89	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfra1a9o000ftraoxgvqwgym	sent	1	\N
cmfradny2000xtrao4rgb3qgm	2025-09-19 20:22:45.236	ORDER_CONFIRMATION	neldis537@gmail.com	cmfradhmu000ptraobhienzws	sent	1	\N
cmfraq5m20016traod3uwh8wn	2025-09-19 20:32:28.273	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfraq2rq000ztraoq2stn73l	sent	1	\N
cmfrb3nm9001etrao2qwrea91	2025-09-19 20:42:58.032	ORDER_CONFIRMATION	neldis537@gmail.com	cmfrb1e570018trao7im015l7	retry	1	queryA ETIMEOUT smtp.gmail.com
cmfrbenyy0007trok3wzxlr06	2025-09-19 20:51:31.707	ORDER_CONFIRMATION	neldis537@gmail.com	cmfrbej6b0001trokkp07o8ts	sent	1	\N
cmfsdahuo000atrugwuyeecne	2025-09-20 14:32:02.644	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfsda8lg0001trugdw9pj79v	sent	1	\N
cmfyn9tgp0008cjasaj90siht	2025-09-24 23:58:04.286	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyn9g1i0001cjasutfnha24	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyna5z4000acjasnox297f0	2025-09-24 23:58:20.604	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyn9g1i0001cjasutfnha24	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfynaikj000ccjasm98f0axg	2025-09-24 23:58:36.929	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyn9g1i0001cjasutfnha24	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfynazcr000ecjasmv5ckpqp	2025-09-24 23:58:58.68	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyn9g1i0001cjasutfnha24	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyomyww000ncjascabsvrzm	2025-09-25 00:36:17.477	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyomjje000icjasunch1rzy	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyonbep000pcjasviuo5esf	2025-09-25 00:36:33.79	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyomjje000icjasunch1rzy	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyonnzn000rcjas6b6mvd2x	2025-09-25 00:36:50.097	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyomjje000icjasunch1rzy	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyoo4rx000tcjasbt3h9rek	2025-09-25 00:37:11.849	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyomjje000icjasunch1rzy	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfypxvuh0006cjng5c0t5q59	2025-09-25 01:12:46.33	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfypxiz20001cjngt65vb8ce	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfypy8cf0008cjngdce38mqk	2025-09-25 01:13:02.652	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfypxiz20001cjngt65vb8ce	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfypykx7000acjng6budbypt	2025-09-25 01:13:18.953	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfypxiz20001cjngt65vb8ce	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfypz1pe000ccjngqdii2h0j	2025-09-25 01:13:40.703	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfypxiz20001cjngt65vb8ce	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyrmxut0007cjhc6q6vpguk	2025-09-25 02:00:14.89	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyrmjy70001cjhc2we0dxx1	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyrn9lc0009cjhcz6bsy6zf	2025-09-25 02:00:30.285	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyrmjy70001cjhc2we0dxx1	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyrnm6a000bcjhc6tv0mxe1	2025-09-25 02:00:46.592	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyrmjy70001cjhc2we0dxx1	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyro5r6000dcjhcqvx2fp9i	2025-09-25 02:01:11.968	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyrmjy70001cjhc2we0dxx1	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfys6jdb0006cjp4b5kp7kg6	2025-09-25 02:15:29.303	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfys666j0001cjp41hok8xwq	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfys6vv50008cjp42m4k7q2r	2025-09-25 02:15:45.613	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfys666j0001cjp41hok8xwq	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfys78g8000acjp41n0midgp	2025-09-25 02:16:01.926	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfys666j0001cjp41hok8xwq	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfys7p8j000ccjp4ra93cjun	2025-09-25 02:16:23.678	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfys666j0001cjp41hok8xwq	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyszuqx000lcjp4iw3rh55k	2025-09-25 02:38:16.907	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyszg5e000gcjp4gyglhujo	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyt07xf000ncjp4m8tnam7a	2025-09-25 02:38:34.252	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyszg5e000gcjp4gyglhujo	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyt0j01000pcjp4d71cmgwc	2025-09-25 02:38:48.622	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyszg5e000gcjp4gyglhujo	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyt0zs9000rcjp4aguaw0ss	2025-09-25 02:39:10.37	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyszg5e000gcjp4gyglhujo	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytds040011cjp42p93vndh	2025-09-25 02:49:06.703	ORDER_CONFIRMATION	maykolperez93@gmail.com	cmfytde9b000vcjp41htcaalj	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyte4hz0013cjp4g5pay0td	2025-09-25 02:49:23.013	ORDER_CONFIRMATION	maykolperez93@gmail.com	cmfytde9b000vcjp41htcaalj	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytegdz0015cjp4p6m3l9c3	2025-09-25 02:49:38.42	ORDER_CONFIRMATION	maykolperez93@gmail.com	cmfytde9b000vcjp41htcaalj	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytesz50017cjp4yc7g7vsi	2025-09-25 02:49:54.732	ORDER_CONFIRMATION	maykolperez93@gmail.com	cmfytde9b000vcjp41htcaalj	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytn2yb001gcjp4io6iazgn	2025-09-25 02:56:20.827	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfytmoqn001bcjp4pi7inq3c	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytnfh3001icjp4z8a7eg4e	2025-09-25 02:56:37.138	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfytmoqn001bcjp4pi7inq3c	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytnrd1001kcjp4r5szsmka	2025-09-25 02:56:52.547	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfytmoqn001bcjp4pi7inq3c	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfytesza0019cjp4ql3on8ep	2025-09-25 02:49:54.74	ORDER_CONFIRMATION	maykolperez93@gmail.com	cmfytde9b000vcjp41htcaalj	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyt0zse000tcjp4s8t8xkip	2025-09-25 02:39:10.38	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyszg5e000gcjp4gyglhujo	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyto3y7001mcjp4ba9velqd	2025-09-25 02:57:08.86	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfytmoqn001bcjp4pi7inq3c	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfzfwaw60008cjt47thlqfon	2025-09-25 13:19:22.512	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfzfvvav0001cjt42pleqynm	sent	1	\N
cmfzgh8n50006cjq8sf2xnz33	2025-09-25 13:35:36.829	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfzgh2d80001cjq8ei9nw8zo	sent	1	\N
cmfzh5icj0006cjc0om18q7iq	2025-09-25 13:54:30.872	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfzh5ayb0001cjc0hwl8r6gb	sent	1	\N
cmg0y1ocn0006cjjk3occ1wr4	2025-09-26 14:35:12.545	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y1am60001cjjkxs0fu3g7	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y205z0008cjjke5iccx2y	2025-09-26 14:35:27.953	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y1am60001cjjkxs0fu3g7	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y2cr1000acjjkz5dnui3s	2025-09-26 14:35:44.266	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y1am60001cjjkxs0fu3g7	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y2tmv000ccjjk3hnwn8bt	2025-09-26 14:36:06.072	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y1am60001cjjkxs0fu3g7	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y8gf5000lcjjkze2oiugz	2025-09-26 14:40:28.845	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y83j6000gcjjkqmvq9qy7	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y8sx5000ncjjkexwkic4u	2025-09-26 14:40:45.157	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y83j6000gcjjkqmvq9qy7	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y95ia000pcjjkeuy9k6w8	2025-09-26 14:41:01.471	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y83j6000gcjjkqmvq9qy7	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y9mai000rcjjkc64fqe0a	2025-09-26 14:41:23.22	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y83j6000gcjjkqmvq9qy7	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0z7vyv0010cjjklnqnq03u	2025-09-26 15:08:01.919	ORDER_CONFIRMATION	reyneldis@gamil.com	cmg0z7ia8000vcjjkr13b32oc	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0z88fp0012cjjk5bmrx7dt	2025-09-26 15:08:18.227	ORDER_CONFIRMATION	reyneldis@gamil.com	cmg0z7ia8000vcjjkr13b32oc	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0z8l0y0014cjjkmb2t3j4h	2025-09-26 15:08:34.543	ORDER_CONFIRMATION	reyneldis@gamil.com	cmg0z7ia8000vcjjkr13b32oc	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0z91t10016cjjk1obtbrjz	2025-09-26 15:08:56.29	ORDER_CONFIRMATION	reyneldis@gamil.com	cmg0z7ia8000vcjjkr13b32oc	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg10hv7t001fcjjkfws7ffud	2025-09-26 15:43:47.156	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg10hgxh001acjjk35emoyua	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg10i7rc001hcjjkru0vemmw	2025-09-26 15:44:03.525	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg10hgxh001acjjk35emoyua	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg10ijls001jcjjko6j2h3ol	2025-09-26 15:44:18.876	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg10hgxh001acjjk35emoyua	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg10iw6m001lcjjklh5lghqh	2025-09-26 15:44:35.18	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg10hgxh001acjjk35emoyua	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg1640kg000ecjks1eav29wh	2025-09-26 18:20:58.625	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg163mji0001cjksbn93u05t	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg164cdw000gcjks2068kqnq	2025-09-26 18:21:14.032	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg163mji0001cjksbn93u05t	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg164oyu000icjksygbfirtf	2025-09-26 18:21:30.338	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg163mji0001cjksbn93u05t	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg1659y4000kcjksomrycohk	2025-09-26 18:21:57.527	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg163mji0001cjksbn93u05t	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg5ubrct0006cjg0fz6jcu6f	2025-09-30 00:49:55.285	ORDER_CONFIRMATION	neldis537@gmail.com	cmg5u9jio0001cjg0tz3fxht3	retry	1	read ECONNRESET
cmg5ucedg0008cjg0z2qvdfnz	2025-09-30 00:50:25.34	ORDER_CONFIRMATION	neldis537@gmail.com	cmg5u9jio0001cjg0tz3fxht3	sent	2	\N
cmglozebz0006cjgoylpvzch0	2025-10-11 03:04:39.357	ORDER_CONFIRMATION	neldis537@gmail.com	cmgloz9yt0001cjgoxvwcb0h0	sent	1	\N
cmfys7p8s000ecjp44x5rcldd	2025-09-25 02:16:23.69	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfys666j0001cjp41hok8xwq	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg1659yf000mcjks7dys0zn2	2025-09-26 18:21:57.539	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg163mji0001cjksbn93u05t	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyto3yl001ocjp41pcm5jzn	2025-09-25 02:57:08.874	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfytmoqn001bcjp4pi7inq3c	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y2tu4000ecjjktr4y2qln	2025-09-26 14:36:06.398	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y1am60001cjjkxs0fu3g7	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0y9max000tcjjktw9t1js4	2025-09-26 14:41:23.235	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg0y83j6000gcjjkqmvq9qy7	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg0z91t50018cjjknp45xd2u	2025-09-26 15:08:56.295	ORDER_CONFIRMATION	reyneldis@gamil.com	cmg0z7ia8000vcjjkr13b32oc	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmg10iw6q001ncjjkc7rge5au	2025-09-26 15:44:35.185	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmg10hgxh001acjjk35emoyua	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyoo4s5000vcjas0dx4c8i8	2025-09-25 00:37:11.86	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyomjje000icjasunch1rzy	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfynazcz000gcjaspcal5rk9	2025-09-24 23:58:58.69	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyn9g1i0001cjasutfnha24	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfypz1pk000ecjngkjtw0fuw	2025-09-25 01:13:40.71	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfypxiz20001cjngt65vb8ce	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmfyro5rd000fcjhc3ma1bq6q	2025-09-25 02:01:11.975	ORDER_CONFIRMATION	reyneldis537@gmail.com	cmfyrmjy70001cjhc2we0dxx1	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmglxvqja0007cjmwv02ooax9	2025-10-11 07:13:44.659	ORDER_CONFIRMATION	neldis537@gmail.com	cmglxvmbe0001cjmwaax5e6d9	sent	1	\N
cmgndtz0d000ecjmw1q40od6o	2025-10-12 07:28:02.58	ORDER_CONFIRMATION	neldis537@gmail.com	cmgndtvmu0009cjmwwps07pzc	sent	1	\N
cmgndy79y000lcjmw8nmaxul6	2025-10-12 07:31:20.088	ORDER_CONFIRMATION	neldis537@gmail.com	cmgndy4w0000gcjmwg8r42gaj	sent	1	\N
cmgp540r90006cj3c2nrcs43z	2025-10-13 12:59:27.245	ORDER_CONFIRMATION	neldis537@gmail.com	cmgp53mes0001cj3c8vyc2d9j	retry	1	getaddrinfo EAI_AGAIN smtp.gmail.com
cmgp54d380008cj3caw2pujuz	2025-10-13 12:59:43.554	ORDER_CONFIRMATION	neldis537@gmail.com	cmgp53mes0001cj3c8vyc2d9j	retry	2	getaddrinfo EAI_AGAIN smtp.gmail.com
cmgp54oz7000acj3cp7qzhb1m	2025-10-13 12:59:58.961	ORDER_CONFIRMATION	neldis537@gmail.com	cmgp53mes0001cj3c8vyc2d9j	retry	3	getaddrinfo EAI_AGAIN smtp.gmail.com
cmgp551kb000ccj3ca06ueiz3	2025-10-13 13:00:15.273	ORDER_CONFIRMATION	neldis537@gmail.com	cmgp53mes0001cj3c8vyc2d9j	retry	4	getaddrinfo EAI_AGAIN smtp.gmail.com
cmgp551kj000ecj3cnk3e50fd	2025-10-13 13:00:15.281	ORDER_CONFIRMATION	neldis537@gmail.com	cmgp53mes0001cj3c8vyc2d9j	failed	3	getaddrinfo EAI_AGAIN smtp.gmail.com
\.


--
-- TOC entry 4946 (class 0 OID 16460)
-- Dependencies: 221
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "productId", "productName", "productSku", price, quantity, total, "createdAt") FROM stdin;
cmehzyb640004waycfufwhdj5	cmehzyb640001waycw8lm8cc2	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	5	101.55	2025-08-19 03:41:15.147
cmei0pc4u0004waewjk4x3k30	cmei0pc4u0001waewyswn0w89	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	8	162.48	2025-08-19 04:02:16.109
cmei2c89l000rwaewamknxp5d	cmei2c89i000owaewq9zsxko0	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	4	43.08	2025-08-19 04:48:03.796
cmeiiopc40004waroogvt5ttu	cmeiiopc40001warogrlsnbvk	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	2	21.54	2025-08-19 12:25:39.652
cmekj4zw40004wa90jnsov7aj	cmekj4zw30001wa9051mmttqv	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	2	40.62	2025-08-20 22:13:52.174
cmekjw13s000bwa90iym34k47	cmekjw13r0008wa90ta57x0kv	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	5	13.3	2025-08-20 22:34:53.462
cmeln52480004wam0c4lxni75	cmeln52470001wam0e6m16zrq	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-08-21 16:53:39.702
cmemjo6890004watkjijlnqus	cmemjo6880001watkoj8ut6n5	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	1	20.31	2025-08-22 08:04:19.204
cmf5o0gkw0006waggi7xfk7dn	cmf5o0gkw0003waggyb5mvoof	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	2	8.66	2025-09-04 17:13:28.303
cmf5o8a40000dwaggcbdin71z	cmf5o8a3z000awaggdtyb75tk	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-04 17:19:33.168
cmf5ogfkk0004waq4a7a98r65	cmf5ogfkk0001waq4z5nc56yu	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-04 17:25:53.492
cmf6t03yz0008wal4m8uvmtgf	cmf6t03yw0001wal4czps50a7	cmefwrem90004wa9go1wrjxgv	Arrocera	arrocera	24.55	1	24.55	2025-09-05 12:20:56.209
cmf6t03yz0007wal43y6xyk4p	cmf6t03yw0001wal4czps50a7	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-05 12:20:56.209
cmf6t03yz0006wal4z6p46iqe	cmf6t03yw0001wal4czps50a7	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-05 12:20:56.209
cmf6t03yy0005wal44nx5ket7	cmf6t03yw0001wal4czps50a7	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	1	20.31	2025-09-05 12:20:56.209
cmf6t03yy0004wal4l5p0cbfx	cmf6t03yw0001wal4czps50a7	cmemevbtc0001wakscu9ckmmj	Detergente en polvo	detergente-en-polvo	4.33	1	4.33	2025-09-05 12:20:56.209
cmf6vi2u70006wabgecf824pv	cmf6vi2u40001wabgz9yl5zaj	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-05 13:30:53.784
cmf6vi2u70005wabgl0h68ue0	cmf6vi2u40001wabgz9yl5zaj	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	1	2.66	2025-09-05 13:30:53.784
cmf6vi2u70004wabg6b5bt5zr	cmf6vi2u40001wabgz9yl5zaj	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-05 13:30:53.784
cmf6wtq6t000ewabgnaich80l	cmf6wtq6s000awabg37g6dd4e	cmefwrem90004wa9go1wrjxgv	Arrocera	arrocera	24.55	2	49.1	2025-09-05 14:07:56.878
cmf6wtq6t000dwabg4wsqoa3p	cmf6wtq6s000awabg37g6dd4e	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	7	1404.62	2025-09-05 14:07:56.878
cmf9aqb7r0004wayw5ra7flbp	cmf9aqb7q0001wayw0g484lfo	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-07 06:12:44.479
cmf9b5o7s0004wa5wv7h0cdhs	cmf9b5o7r0001wa5wizota04d	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-07 06:24:41.169
cmfbdnekg0004wa5wqaj3cjlt	cmfbdneke0001wa5wfdcgnthi	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	19	82.27	2025-09-08 17:10:00.056
cmfbgba3l0004waw0tu0l6f8r	cmfbgba3k0001waw0t5d1podz	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-08 18:24:33.242
cmfbnymmx0006wa6oimss2ci7	cmfbnymmu0001wa6o44brtbd7	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-08 21:58:39.889
cmfbnymmw0005wa6oljqo8i1y	cmfbnymmu0001wa6o44brtbd7	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	2	247.98	2025-09-08 21:58:39.889
cmfbnymmw0004wa6o9dh34kdo	cmfbnymmu0001wa6o44brtbd7	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-08 21:58:39.889
cmfdc07cc0004wa4sv2vlkta0	cmfdc07cb0001wa4ssfeqjkgl	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	16	69.28	2025-09-10 01:59:30.341
cmfdd18em000jwa4syjt0mlpe	cmfdd18el000gwa4shywc2uaw	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	3	371.97	2025-09-10 02:28:17.997
cmfddcj5l000ywa4scp6f65fh	cmfddcj5l000vwa4s5ckur8nx	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-10 02:37:05.145
cmfdf36u6001fwa4sf3lsqksa	cmfdf36u3001awa4smijlvoet	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-10 03:25:48.505
cmfdf36u6001ewa4smyqjr5gc	cmfdf36u3001awa4smijlvoet	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	2	5.32	2025-09-10 03:25:48.505
cmfdf36u5001dwa4sqexugdjc	cmfdf36u3001awa4smijlvoet	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	15	64.95	2025-09-10 03:25:48.505
cmfr9kytk0004traob1is9pgm	cmfr9kytk0001traoo7epylud	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	1	8.99	2025-09-19 20:00:26.692
cmfr9olwk000btraogl0izcmr	cmfr9olwk0008traobwzs8faz	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-19 20:03:16.58
cmfra1a9s000ltraoqbyndv0t	cmfra1a9o000ftraoxgvqwgym	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-19 20:13:07.951
cmfra1a9s000ktrao2mtmzx06	cmfra1a9o000ftraoxgvqwgym	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-19 20:13:07.951
cmfra1a9s000jtrao1tjsvp74	cmfra1a9o000ftraoxgvqwgym	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	1	20.31	2025-09-19 20:13:07.951
cmfra1a9s000itraoqmwmzl0q	cmfra1a9o000ftraoxgvqwgym	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-19 20:13:07.951
cmfradhmv000vtraopulp62s1	cmfradhmu000ptraobhienzws	cmei1yr70000dwaewcromuv9n	Puré de tomate	pure-tomate	0.89	1	0.89	2025-09-19 20:22:37.443
cmfradhmu000utrao13gf0fjf	cmfradhmu000ptraobhienzws	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-19 20:22:37.443
cmfradhmu000ttraos7agks4d	cmfradhmu000ptraobhienzws	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-19 20:22:37.443
cmfradhmu000straoz0kco4d3	cmfradhmu000ptraobhienzws	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	1	2.66	2025-09-19 20:22:37.443
cmfraq2rr0014traobfs9strh	cmfraq2rq000ztraoq2stn73l	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-19 20:32:24.71
cmfraq2rr0013traoawoev2sy	cmfraq2rq000ztraoq2stn73l	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	1	20.31	2025-09-19 20:32:24.71
cmfraq2rr0012traob18d0qua	cmfraq2rq000ztraoq2stn73l	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-19 20:32:24.71
cmfrb1e58001ctraosw8gacqg	cmfrb1e570018trao7im015l7	cmeh07dk40001wauo2w3jsg88	Ventilador recargable	ventilador-recargable	20.31	1	20.31	2025-09-19 20:41:12.66
cmfrb1e58001btraocjqhdmq5	cmfrb1e570018trao7im015l7	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-19 20:41:12.66
cmfrbej6d0005trokpcp7oxgg	cmfrbej6b0001trokkp07o8ts	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-19 20:51:25.71
cmfrbej6c0004trokhzdhr0eo	cmfrbej6b0001trokkp07o8ts	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	1	8.99	2025-09-19 20:51:25.71
cmfsda8li0008trug0xsh4qf4	cmfsda8lg0001trugdw9pj79v	cmfo6kyds0003trxcwxl7dzcz	Champu  	champu	6.97	1	6.97	2025-09-20 14:31:50.777
cmfsda8li0007trug3cdqsm4j	cmfsda8lg0001trugdw9pj79v	cmfn1d6660005trr8jnbo5zkr	Javon	javon	1.31	1	1.31	2025-09-20 14:31:50.777
cmfsda8li0006trug7spku9s9	cmfsda8lg0001trugdw9pj79v	cmfmz0tqu001atric14quaazt	Pasta	pasta	2.99	1	2.99	2025-09-20 14:31:50.777
cmfsda8li0005trugs42a286w	cmfsda8lg0001trugdw9pj79v	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	1	2.66	2025-09-20 14:31:50.777
cmfsda8li0004trugxqb01k69	cmfsda8lg0001trugdw9pj79v	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-20 14:31:50.777
cmfyn9g1j0006cjasqjel72fe	cmfyn9g1i0001cjasutfnha24	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	1	2.66	2025-09-24 23:57:46.98
cmfyn9g1j0005cjasd5cqb0s2	cmfyn9g1i0001cjasutfnha24	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-24 23:57:46.98
cmfyn9g1i0004cjasfqp5pvs5	cmfyn9g1i0001cjasutfnha24	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-24 23:57:46.98
cmfyomjjf000lcjasgqfkndx2	cmfyomjje000icjasunch1rzy	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-25 00:35:57.657
cmfypxiz30004cjnguch76z7o	cmfypxiz20001cjngt65vb8ce	cmfn1d6660005trr8jnbo5zkr	Javon	javon	1.31	1	1.31	2025-09-25 01:12:29.762
cmfyrmjy80005cjhcs858a48l	cmfyrmjy70001cjhc2we0dxx1	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	1	8.99	2025-09-25 01:59:57.05
cmfyrmjy80004cjhcefswic8f	cmfyrmjy70001cjhc2we0dxx1	cmfmz0tqu001atric14quaazt	Pasta	pasta	2.99	1	2.99	2025-09-25 01:59:57.05
cmfys666l0004cjp4av1icic5	cmfys666j0001cjp41hok8xwq	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-25 02:15:12.321
cmfyszg5t000jcjp4lc0wbumj	cmfyszg5e000gcjp4gyglhujo	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-09-25 02:37:58.095
cmfytde9k000zcjp4i9bg3ehf	cmfytde9b000vcjp41htcaalj	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-25 02:48:48.985
cmfytde9g000ycjp4w8hc6rtg	cmfytde9b000vcjp41htcaalj	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	1	2.66	2025-09-25 02:48:48.985
cmfytmoqo001ecjp4fdsl31o5	cmfytmoqn001bcjp4pi7inq3c	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	1	4.33	2025-09-25 02:56:02.495
cmfzfvvaw0006cjt4c90alipc	cmfzfvvav0001cjt42pleqynm	cmfn1d6660005trr8jnbo5zkr	Javon	javon	1.31	9	11.79	2025-09-25 13:19:02.446
cmfzfvvaw0005cjt4km3a8ela	cmfzfvvav0001cjt42pleqynm	cmfmz0tqu001atric14quaazt	Pasta	pasta	2.99	8	23.92	2025-09-25 13:19:02.446
cmfzfvvaw0004cjt422bn4lzr	cmfzfvvav0001cjt42pleqynm	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	8	71.92	2025-09-25 13:19:02.446
cmfzgh2d80004cjq8d2mzpf7n	cmfzgh2d80001cjq8ei9nw8zo	cmei1yr70000dwaewcromuv9n	Puré de tomate	pure-tomate	0.89	1	0.89	2025-09-25 13:35:31.384
cmfzh5ayc0004cjc0dshj3ymk	cmfzh5ayb0001cjc0hwl8r6gb	cmfn1d6660005trr8jnbo5zkr	Javon	javon	1.31	1	1.31	2025-09-25 13:54:22.253
cmg0y1am70004cjjk54fcoh2f	cmg0y1am60001cjjkxs0fu3g7	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-26 14:34:54.842
cmg0y83j7000jcjjkq7taphyz	cmg0y83j6000gcjjkqmvq9qy7	cmfo6kyds0003trxcwxl7dzcz	Champu  	champu	6.97	1	6.97	2025-09-26 14:40:12.249
cmg0z7ia9000ycjjklodxz583	cmg0z7ia8000vcjjkr13b32oc	cmemevbtc0001wakscu9ckmmj	Detergente en polvo	detergente-en-polvo	4.33	1	4.33	2025-09-26 15:07:44.322
cmg10hgxj001dcjjkm7m5hfcj	cmg10hgxh001acjjk35emoyua	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	1	200.66	2025-09-26 15:43:28.748
cmg163mjo000ccjks5k8s0n86	cmg163mji0001cjksbn93u05t	cmefwrem90004wa9go1wrjxgv	Arrocera	arrocera	24.55	2	49.1	2025-09-26 18:20:40.535
cmg163mjo000bcjksudi32hi5	cmg163mji0001cjksbn93u05t	cmemevbtc0001wakscu9ckmmj	Detergente en polvo	detergente-en-polvo	4.33	1	4.33	2025-09-26 18:20:40.535
cmg163mjn000acjksosnlucl5	cmg163mji0001cjksbn93u05t	cmfo6kyds0003trxcwxl7dzcz	Champu  	champu	6.97	1	6.97	2025-09-26 18:20:40.535
cmg163mjn0009cjkssi671huh	cmg163mji0001cjksbn93u05t	cmfn1d6660005trr8jnbo5zkr	Javon	javon	1.31	1	1.31	2025-09-26 18:20:40.535
cmg163mjm0008cjks677wz8te	cmg163mji0001cjksbn93u05t	cmei20ojf000gwaewgpd70ap0	Cafe	cafe	2.66	5	13.3	2025-09-26 18:20:40.535
cmg163mjm0007cjks1qj6dq86	cmg163mji0001cjksbn93u05t	cmeh25lbq0001wakcul5ur38t	Paquete de pollo	paquete-de-pollo	10.77	1	10.77	2025-09-26 18:20:40.535
cmg163mjl0006cjks6lvdpn8y	cmg163mji0001cjksbn93u05t	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	2	247.98	2025-09-26 18:20:40.535
cmg163mjl0005cjkser00w3gs	cmg163mji0001cjksbn93u05t	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	2	17.98	2025-09-26 18:20:40.535
cmg163mjl0004cjksluoa7x0s	cmg163mji0001cjksbn93u05t	cmfmz0tqu001atric14quaazt	Pasta	pasta	2.99	16	47.84	2025-09-26 18:20:40.535
cmg5u9jip0004cjg04g5ytni1	cmg5u9jio0001cjg0tz3fxht3	cmefxdh2w0007wa9gqbjbdeaa	Lavadora	labadora	200.66	3	601.98	2025-09-30 00:48:12.042
cmgloz9yx0004cjgoq4o52u2a	cmgloz9yt0001cjgoxvwcb0h0	cmgknd1o60001cjtc0f4wvgnn	prueba	prueba	22	1	22	2025-10-11 03:04:33.834
cmglxvmbe0005cjmwmqnp57ax	cmglxvmbe0001cjmwaax5e6d9	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	3	26.97	2025-10-11 07:13:39.708
cmglxvmbe0004cjmw9hi32qpw	cmglxvmbe0001cjmwaax5e6d9	cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99	1	123.99	2025-10-11 07:13:39.708
cmgndtvmw000ccjmwtmqtljoq	cmgndtvmu0009cjmwwps07pzc	cmei22dkr000jwaewiy53rskc	Café la llave	cafeLaLLave	4.33	3	12.99	2025-10-12 07:27:58.552
cmgndy4w1000jcjmwnycj9y43	cmgndy4w0000gcjmwg8r42gaj	cmgknd1o60001cjtc0f4wvgnn	prueba	prueba	22	2	44	2025-10-12 07:31:17.184
cmgp53met0004cj3csk69h53u	cmgp53mes0001cj3c8vyc2d9j	cmfmwxrje0015tricgzilvp56	Champu Sin Sal Oro Liquido	champu-sin-sal-oro-liquido	8.99	2	17.98	2025-10-13 12:59:08.976
\.


--
-- TOC entry 4947 (class 0 OID 16466)
-- Dependencies: 222
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "orderNumber", "userId", status, "customerEmail", subtotal, "taxAmount", "shippingAmount", total, "createdAt", "updatedAt") FROM stdin;
cmeb2hrlt000cwa9c1zvs9qk9	#878902	cmeb0nzvp0000wa7g3if2r6a6	DELIVERED	reyneldis537@gmail.com	32.97	0	0	32.97	2025-08-14 07:17:58.907	2025-08-17 04:52:32.552
cmehzyb640001waycw8lm8cc2	#875138	\N	PENDING	reyneldis537@gmail.com	101.55	0	0	101.55	2025-08-19 03:41:15.147	2025-08-19 03:41:15.147
cmei0pc4u0001waewyswn0w89	#136105	\N	PENDING	reyneldis537@gmail.com	162.48	0	0	162.48	2025-08-19 04:02:16.109	2025-08-19 04:02:16.109
cmei2c89i000owaewq9zsxko0	#883787	cmeb0nzvp0000wa7g3if2r6a6	PENDING	reyneldis537@gmail.com	43.08	0	0	43.08	2025-08-19 04:48:03.796	2025-08-19 04:48:03.796
cmekj4zw30001wa9051mmttqv	#032170	\N	PENDING	reyneldis537@gmail.com	40.62	0	0	40.62	2025-08-20 22:13:52.174	2025-08-20 22:13:52.174
cmekjw13r0008wa90ta57x0kv	#293458	\N	PENDING	reyneldis537@gmail.com	13.3	0	0	13.3	2025-08-20 22:34:53.462	2025-08-20 22:34:53.462
cmeln52470001wam0e6m16zrq	#219696	\N	PENDING	reyneldis537@gmail.com	200.66	0	0	200.66	2025-08-21 16:53:39.702	2025-08-21 16:53:39.702
cmemjo6880001watkoj8ut6n5	#859186	\N	PENDING	reyneldis537@gmail.com	20.31	0	0	20.31	2025-08-22 08:04:19.204	2025-08-22 08:04:19.204
cmf5o0gkw0003waggyb5mvoof	#008283	cmeb0nzvp0000wa7g3if2r6a6	PENDING	neldis537@gmail.com	8.66	0	0	8.66	2025-09-04 17:13:28.303	2025-09-04 17:13:28.303
cmf5o8a3z000awaggdtyb75tk	#373165	cmeb0nzvp0000wa7g3if2r6a6	PENDING	reyneldis537@gmail.com	200.66	0	0	200.66	2025-09-04 17:19:33.168	2025-09-04 17:19:33.168
cmf5ogfkk0001waq4z5nc56yu	#753486	cmeb0nzvp0000wa7g3if2r6a6	PENDING	reyneldis537@gmail.com	123.99	0	0	123.99	2025-09-04 17:25:53.492	2025-09-04 17:25:53.492
cmf9aqb7q0001wayw0g484lfo	#564466	\N	PENDING	neldis537@gmail.com	123.99	0	0	123.99	2025-09-07 06:12:44.479	2025-09-07 06:12:44.479
cmf9b5o7r0001wa5wizota04d	#281150	\N	PENDING	neldis537@gmail.com	4.33	0	0	4.33	2025-09-07 06:24:41.169	2025-09-07 06:24:41.169
cmfbdneke0001wa5wfdcgnthi	#400045	\N	PENDING	neldis537@gmail.com	82.27	0	0	82.27	2025-09-08 17:10:00.056	2025-09-08 17:10:00.056
cmfbgba3k0001waw0t5d1podz	#873233	\N	PENDING	neldis537@gmail.com	4.33	0	0	4.33	2025-09-08 18:24:33.242	2025-09-08 18:24:33.242
cmfdf36u3001awa4smijlvoet	#748500	\N	DELIVERED	reyneldis@gamil.com	194.26	0	0	194.26	2025-09-10 03:25:48.505	2025-09-15 15:39:03.991
cmfddcj5l000vwa4s5ckur8nx	#825134	\N	CANCELLED	reyneldis537@gmail.com	4.33	0	0	4.33	2025-09-10 02:37:05.145	2025-09-15 15:39:44.571
cmfdc07cb0001wa4ssfeqjkgl	#570329	\N	REFUNDED	neldis537@gmail.com	69.28	0	0	69.28	2025-09-10 01:59:30.341	2025-09-15 15:40:02.741
cmfbnymmu0001wa6o44brtbd7	#719881	\N	SHIPPED	neldis537@gmail.com	263.08	0	0	263.08	2025-09-08 21:58:39.889	2025-09-15 15:41:14.146
cmeiiopc40001warogrlsnbvk	#339649	\N	PROCESSING	elizabeth@gmail.com	21.54	0	0	21.54	2025-08-19 12:25:39.652	2025-09-15 15:41:37.141
cmfdd18el000gwa4shywc2uaw	#297976	\N	PROCESSING	neldis537@gmail.com	371.97	0	0	371.97	2025-09-10 02:28:17.997	2025-09-15 16:32:24.843
cmf6wtq6s000awabg37g6dd4e	#276873	\N	SHIPPED	reyneldis537@gmail.com	1453.72	0	0	1453.72	2025-09-05 14:07:56.878	2025-09-15 16:36:06.2
cmf6vi2u40001wabgz9yl5zaj	#053779	\N	DELIVERED	reyneldis537@gmail.com	17.76	0	0	17.76	2025-09-05 13:30:53.784	2025-09-16 17:45:05.764
cmf6t03yw0001wal4czps50a7	#856198	\N	PROCESSING	reyneldis537@gmail.com	373.84	0	0	373.84	2025-09-05 12:20:56.209	2025-09-16 17:54:04.988
cmfr9kytk0001traoo7epylud	#026678	\N	PENDING	reyneldis537@gmail.com	8.99	0	0	8.99	2025-09-19 20:00:26.692	2025-09-19 20:00:26.692
cmfr9olwk0008traobwzs8faz	#196569	\N	PENDING	neldis537@gmail.com	4.33	0	0	4.33	2025-09-19 20:03:16.58	2025-09-19 20:03:16.58
cmfra1a9o000ftraoxgvqwgym	#787944	\N	PENDING	reyneldis537@gmail.com	355.73	0	0	355.73	2025-09-19 20:13:07.951	2025-09-19 20:13:07.951
cmfradhmu000ptraobhienzws	#357427	\N	PENDING	neldis537@gmail.com	18.65	0	0	18.65	2025-09-19 20:22:37.443	2025-09-19 20:22:37.443
cmfraq2rq000ztraoq2stn73l	#944706	\N	PENDING	reyneldis537@gmail.com	231.74	0	0	231.74	2025-09-19 20:32:24.71	2025-09-19 20:32:24.71
cmfrb1e570018trao7im015l7	#472644	\N	PENDING	neldis537@gmail.com	31.08	0	0	31.08	2025-09-19 20:41:12.66	2025-09-19 20:41:12.66
cmfrbej6b0001trokkp07o8ts	#085698	\N	PENDING	neldis537@gmail.com	132.98	0	0	132.98	2025-09-19 20:51:25.71	2025-09-19 20:51:25.71
cmfsda8lg0001trugdw9pj79v	#710766	\N	PENDING	reyneldis537@gmail.com	18.26	0	0	18.26	2025-09-20 14:31:50.777	2025-09-20 14:31:50.777
cmfyn9g1i0001cjasutfnha24	#266960	\N	PENDING	reyneldis537@gmail.com	130.98	0	0	130.98	2025-09-24 23:57:46.98	2025-09-24 23:57:46.98
cmfyomjje000icjasunch1rzy	#557553	\N	PENDING	reyneldis537@gmail.com	123.99	0	0	123.99	2025-09-25 00:35:57.657	2025-09-25 00:35:57.657
cmfypxiz20001cjngt65vb8ce	#749751	\N	PENDING	reyneldis537@gmail.com	1.31	0	0	1.31	2025-09-25 01:12:29.762	2025-09-25 01:12:29.762
cmfyrmjy70001cjhc2we0dxx1	#597040	\N	PENDING	reyneldis537@gmail.com	11.98	0	0	11.98	2025-09-25 01:59:57.05	2025-09-25 01:59:57.05
cmfys666j0001cjp41hok8xwq	#512311	\N	PENDING	reyneldis537@gmail.com	123.99	0	0	123.99	2025-09-25 02:15:12.321	2025-09-25 02:15:12.321
cmfyszg5e000gcjp4gyglhujo	ORD-878045	\N	PENDING	reyneldis537@gmail.com	123.99	0	0	123.99	2025-09-25 02:37:58.095	2025-09-25 02:37:58.095
cmfytde9b000vcjp41htcaalj	#528972	\N	PENDING	maykolperez93@gmail.com	13.43	0	0	13.43	2025-09-25 02:48:48.985	2025-09-25 02:48:48.985
cmfytmoqn001bcjp4pi7inq3c	#962479	\N	PENDING	reyneldis537@gmail.com	4.33	0	0	4.33	2025-09-25 02:56:02.495	2025-09-25 02:56:02.495
cmfzfvvav0001cjt42pleqynm	#342426	\N	PENDING	reyneldis537@gmail.com	107.63	0	0	107.63	2025-09-25 13:19:02.446	2025-09-25 13:19:02.446
cmfzgh2d80001cjq8ei9nw8zo	#331377	\N	PENDING	reyneldis537@gmail.com	0.89	0	0	0.89	2025-09-25 13:35:31.384	2025-09-25 13:35:31.384
cmfzh5ayb0001cjc0hwl8r6gb	#462229	\N	PENDING	reyneldis537@gmail.com	1.31	0	0	1.31	2025-09-25 13:54:22.253	2025-09-25 13:54:22.253
cmg0y1am60001cjjkxs0fu3g7	#294835	\N	PENDING	reyneldis537@gmail.com	200.66	0	0	200.66	2025-09-26 14:34:54.842	2025-09-26 14:34:54.842
cmg0y83j6000gcjjkqmvq9qy7	#612241	\N	PENDING	reyneldis537@gmail.com	6.97	0	0	6.97	2025-09-26 14:40:12.249	2025-09-26 14:40:12.249
cmg0z7ia8000vcjjkr13b32oc	#264276	\N	PENDING	reyneldis@gamil.com	4.33	0	0	4.33	2025-09-26 15:07:44.322	2025-09-26 15:07:44.322
cmg10hgxh001acjjk35emoyua	#408736	\N	PENDING	reyneldis537@gmail.com	200.66	0	0	200.66	2025-09-26 15:43:28.748	2025-09-26 15:43:28.748
cmg5u9jio0001cjg0tz3fxht3	#292035	\N	CONFIRMED	neldis537@gmail.com	601.98	0	0	601.98	2025-09-30 00:48:12.042	2025-10-10 08:37:21.594
cmg163mji0001cjksbn93u05t	#840520	\N	CONFIRMED	reyneldis537@gmail.com	399.58	0	0	399.58	2025-09-26 18:20:40.535	2025-10-10 08:38:03.731
cmgloz9yt0001cjgoxvwcb0h0	#873828	\N	PENDING	neldis537@gmail.com	22	0	0	22	2025-10-11 03:04:33.834	2025-10-11 03:04:33.834
cmglxvmbe0001cjmwaax5e6d9	#819696	\N	PENDING	neldis537@gmail.com	150.96	0	0	150.96	2025-10-11 07:13:39.708	2025-10-11 07:13:39.708
cmgndtvmu0009cjmwwps07pzc	#078536	\N	PENDING	neldis537@gmail.com	12.99	0	0	12.99	2025-10-12 07:27:58.552	2025-10-12 07:27:58.552
cmgndy4w0000gcjmwg8r42gaj	#277174	\N	PENDING	neldis537@gmail.com	44	0	0	44	2025-10-12 07:31:17.184	2025-10-12 07:31:17.184
cmgp53mes0001cj3c8vyc2d9j	#348970	\N	PENDING	neldis537@gmail.com	17.98	0	0	17.98	2025-10-13 12:59:08.976	2025-10-13 12:59:08.976
\.


--
-- TOC entry 4948 (class 0 OID 16475)
-- Dependencies: 223
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", url, alt, "sortOrder", "isPrimary", "createdAt") FROM stdin;
cmefwrem90005wa9gep0pizu4	cmefwrem90004wa9go1wrjxgv	/uploads/products/36b6cd5c-bc8e-4368-94e9-863bd88579a8.webp	Arrocera	0	t	2025-08-17 16:36:21.825
cmefxdh2x0008wa9ghva5csmx	cmefxdh2w0007wa9gqbjbdeaa	/uploads/products/8487e202-8378-4904-8c15-32ea5e3aabb1.webp	Lavadora	0	t	2025-08-17 16:53:31.447
cmeh07dk40002wauobqy38zuq	cmeh07dk40001wauo2w3jsg88	/uploads/products/cb2c38fe-5488-4f47-835e-adea89fc1f16.webp	Ventilador recargable	0	t	2025-08-18 11:00:31.971
cmei1w40n000bwaew15fsnnq8	cmeh25lbq0001wakcul5ur38t	/uploads/products/ba4ea4ce-5e2d-4323-8306-3efa5b97e7c5.webp	\N	0	t	2025-08-19 04:35:31.785
cmei1yr70000ewaewmtqoubvd	cmei1yr70000dwaewcromuv9n	/uploads/products/51eb5a9b-c9a3-4ca3-8ca9-9d4cd47f547d.webp	Puré de tomate	0	t	2025-08-19 04:37:35.148
cmei20ojf000hwaewycx873uy	cmei20ojf000gwaewgpd70ap0	/uploads/products/da070215-8a9d-42c7-89ad-c771010d3351.webp	Cafe	0	t	2025-08-19 04:39:05.014
cmei22dkr000kwaewwqb9jcn9	cmei22dkr000jwaewiy53rskc	/uploads/products/44d85fdb-119b-404e-9fe2-df177c7a8b69.webp	Café la llave	0	t	2025-08-19 04:40:24.122
cmemevbxy0002waksnta7uvbb	cmemevbtc0001wakscu9ckmmj	/uploads/products/2e4f9adc-6566-4f4e-8b60-e8430f1687d7.webp	Detergente en polvo	0	t	2025-08-22 05:49:55.126
cmf5m0zwk0002wa7kyyk3e2ly	cmf5m0zrq0001wa7kjgyjpbo4	/uploads/products/29aa5ff0-6d4f-4a82-a480-4af8d9aefb29.webp	tv	0	t	2025-09-04 16:17:54.117
cmfmwxs1a0017tric76xmu4ut	cmfmwxrje0015tricgzilvp56	/uploads/products/cmfmwxrje0015tricgzilvp56-1758048924702-aseo-2.webp	Champu Sin Sal Oro Liquido	0	t	2025-09-16 18:55:24.718
cmfmz0ttu001ctrickndc23o9	cmfmz0tqu001atric14quaazt	/uploads/products/cmfmz0tqu001atric14quaazt-1758052426235-aseo-4.webp	Pasta	0	t	2025-09-16 19:53:46.242
cmfn1d6820007trr8klv7odkl	cmfn1d6660005trr8jnbo5zkr	/uploads/products/cmfn1d6660005trr8jnbo5zkr-1758056361391-aseo-3.webp	Javon	0	t	2025-09-16 20:59:21.411
cmfo6kygu0005trxcsfihadya	cmfo6kyds0003trxcwxl7dzcz	/uploads/products/cmfo6kyds0003trxcwxl7dzcz-1758125588850-aseo-5.webp	Champu  	0	t	2025-09-17 16:13:08.862
cmgknd1sv0003cjtc0b3im3w5	cmgknd1o60001cjtc0f4wvgnn	/uploads/products/cmgknd1o60001cjtc0f4wvgnn-1760088691033-asaaa.webp	prueba	0	t	2025-10-10 09:31:31.039
\.


--
-- TOC entry 4949 (class 0 OID 16483)
-- Dependencies: 224
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, slug, "productName", price, description, "categoryId", "createdAt", "updatedAt", featured, features, status, stock, "searchText") FROM stdin;
cmgknd1o60001cjtc0f4wvgnn	prueba	prueba	22		cmeb173vw0001walc7x6k581f	2025-10-10 09:31:30.852	2025-10-12 07:31:26.645	t	{}	ACTIVE	17	'com':2 'prueb':1
cmeh07dk40001wauo2w3jsg88	ventilador-recargable	Ventilador recargable	20.31		cmefucl7m0000wa3smr9pytdf	2025-08-18 11:00:31.971	2025-10-05 17:39:47.929	t	{}	ACTIVE	60	'electrodomest':3 'recarg':2 'ventil':1
cmefwrem90004wa9go1wrjxgv	arrocera	Arrocera	24.55	Arrocera Negra	cmefucl7m0000wa3smr9pytdf	2025-08-17 16:36:21.825	2025-10-05 19:03:51.478	t	{}	ACTIVE	38	'arrocer':1,2 'electrodomest':4 'negr':3
cmfmz0tqu001atric14quaazt	pasta	Pasta	2.99	Pasta dental Colgate	cmefspwho0000waj8cqv2x3pl	2025-09-16 19:53:46.127	2025-10-08 13:33:25.905	t	{12ml}	ACTIVE	71	'ase':5 'colgat':4 'dental':3 'past':1,2
cmfmwxrje0015tricgzilvp56	champu-sin-sal-oro-liquido	Champu Sin Sal Oro Liquido	8.99		cmefspwho0000waj8cqv2x3pl	2025-09-16 18:55:24.059	2025-10-13 13:00:31.078	t	{}	ACTIVE	71	'ase':6 'champu':1 'liqu':5 'oro':4 'sal':3
cmefxdh2w0007wa9gqbjbdeaa	labadora	Lavadora	200.66	Lavadora de carga frontal con tecnología Steam y 6 Motion	cmefucl7m0000wa3smr9pytdf	2025-08-17 16:53:31.447	2025-10-05 20:01:55.428	t	{}	ACTIVE	37	'6':10 'carg':4 'electrodomest':12 'frontal':5 'lavador':1,2 'motion':11 'steam':8 'tecnolog':7
cmfo6kyds0003trxcwxl7dzcz	champu	Champu  	6.97		cmefspwho0000waj8cqv2x3pl	2025-09-17 16:13:08.752	2025-10-08 13:33:56.219	f	{"Sin Sal"}	ACTIVE	69	'ase':2 'champu':1
cmeh25lbq0001wakcul5ur38t	paquete-de-pollo	Paquete de pollo	10.77		cmeb173vw0001walc7x6k581f	2025-08-18 11:55:07.947	2025-10-08 14:06:30.861	t	{}	ACTIVE	35	'com':4 'paquet':1 'poll':3
cmemevbtc0001wakscu9ckmmj	detergente-en-polvo	Detergente en polvo	4.33	Detergente Omo	cmefspwho0000waj8cqv2x3pl	2025-08-22 05:49:54.951	2025-10-21 14:44:50.54	f	{}	ACTIVE	19	'ase':6 'detergent':1,4 'omo':5 'polv':3
cmfn1d6660005trr8jnbo5zkr	javon	Javon	1.31		cmefspwho0000waj8cqv2x3pl	2025-09-16 20:59:21.342	2025-10-08 15:37:14.309	f	{}	ACTIVE	29	'ase':2 'javon':1
cmf5m0zrq0001wa7kjgyjpbo4	tv	tv	123.99		cmefucl7m0000wa3smr9pytdf	2025-09-04 16:17:53.938	2025-10-12 07:25:55.708	t	{"Tv insignia"}	ACTIVE	16	'electrodomest':2 'tv':1
cmei20ojf000gwaewgpd70ap0	cafe	Cafe	2.66		cmeb173vw0001walc7x6k581f	2025-08-19 04:39:05.014	2025-10-08 15:19:04.251	t	{}	ACTIVE	48	'caf':1 'com':2
cmei22dkr000jwaewiy53rskc	cafeLaLLave	Café la llave	4.33		cmeb173vw0001walc7x6k581f	2025-08-19 04:40:24.122	2025-10-12 07:28:09.531	t	{}	ACTIVE	69	'caf':1 'com':4 'llav':3
cmei1yr70000dwaewcromuv9n	pure-tomate	Puré de tomate	0.89		cmeb173vw0001walc7x6k581f	2025-08-19 04:37:35.148	2025-10-08 16:48:05.189	f	{}	ACTIVE	41	'com':4 'pur':1 'tomat':3
\.


--
-- TOC entry 4950 (class 0 OID 16492)
-- Dependencies: 225
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "userId", "productId", rating, comment, "isApproved", "createdAt", "updatedAt") FROM stdin;
cmei0xqiw000awaewtny4dp5n	cmehjl9wy0000wa0ox8dkfqrh	cmeh07dk40001wauo2w3jsg88	5	Sus productos muy buenos, gracias por traerlo a tiempo , espero seguir disfrutando de sus servicios.	t	2025-08-19 04:08:48.008	2025-08-19 04:08:48.008
cmei2b1zt000mwaewi5rh9wwc	cmeb0nzvp0000wa7g3if2r6a6	cmeh25lbq0001wakcul5ur38t	5	Nuevos productos excelentes , mucha determinación y  prestigio al entregar sus pedidos, llego a tiempo todo	t	2025-08-19 04:47:09.014	2025-08-19 04:47:09.014
cmeiergjy0001wa8sjgornp4n	cmeb0nzvp0000wa7g3if2r6a6	cmeh07dk40001wauo2w3jsg88	4	Gracias a todos por el buen trabajo, mis saludos 	t	2025-08-19 10:35:49.764	2025-08-19 10:35:49.764
cmf9817n10001wadsq26i7bh6	cmeb0nzvp0000wa7g3if2r6a6	cmf5m0zrq0001wa7kjgyjpbo4	3	buenas noches gracias por llegar a tiempo	t	2025-09-07 04:57:14.214	2025-09-07 04:57:14.214
cmgi16v9e0003cjjo94wg8izh	cmeb0nzvp0000wa7g3if2r6a6	cmfo6kyds0003trxcwxl7dzcz	4	hola, k bueno salber de ustedes, good	t	2025-10-08 13:35:18.551	2025-10-08 13:35:18.551
\.


--
-- TOC entry 4951 (class 0 OID 16499)
-- Dependencies: 226
-- Data for Name: shipping_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.shipping_addresses (id, street, city, state, zip, country, "createdAt", "updatedAt", "orderId") FROM stdin;
cmeb2hrlt000ewa9cp9rbic7e	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-14 07:17:58.907	2025-08-14 07:17:58.907	cmeb2hrlt000cwa9c1zvs9qk9
cmehzyb640003wayc7yq2to6h	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-19 03:41:15.147	2025-08-19 03:41:15.147	cmehzyb640001waycw8lm8cc2
cmei0pc4u0003waewea9o7l3x	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-08-19 04:02:16.109	2025-08-19 04:02:16.109	cmei0pc4u0001waewyswn0w89
cmei2c89k000qwaewgbczywy1	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-19 04:48:03.796	2025-08-19 04:48:03.796	cmei2c89i000owaewq9zsxko0
cmeiiopc40003warojhzxuduw	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-08-19 12:25:39.652	2025-08-19 12:25:39.652	cmeiiopc40001warogrlsnbvk
cmekj4zw40003wa90qaykbxsl	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-08-20 22:13:52.174	2025-08-20 22:13:52.174	cmekj4zw30001wa9051mmttqv
cmekjw13r000awa90oiy4kh9d	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-20 22:34:53.462	2025-08-20 22:34:53.462	cmekjw13r0008wa90ta57x0kv
cmeln52480003wam074x6x0vq	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-21 16:53:39.702	2025-08-21 16:53:39.702	cmeln52470001wam0e6m16zrq
cmemjo6890003watkw62vmrkd	calle f #33	Cuba	Camaguey	12312	Cuba	2025-08-22 08:04:19.204	2025-08-22 08:04:19.204	cmemjo6880001watkoj8ut6n5
cmf5o0gkw0005wagg39wtnxjf	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-04 17:13:28.303	2025-09-04 17:13:28.303	cmf5o0gkw0003waggyb5mvoof
cmf5o8a40000cwaggys3l6ujn	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-09-04 17:19:33.168	2025-09-04 17:19:33.168	cmf5o8a3z000awaggdtyb75tk
cmf5ogfkk0003waq4i30j0c9t	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-04 17:25:53.492	2025-09-04 17:25:53.492	cmf5ogfkk0001waq4z5nc56yu
cmf6t03yy0003wal4ncgb4zns	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-05 12:20:56.209	2025-09-05 12:20:56.209	cmf6t03yw0001wal4czps50a7
cmf6vi2u60003wabg8ygo9zcs	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-05 13:30:53.784	2025-09-05 13:30:53.784	cmf6vi2u40001wabgz9yl5zaj
cmf6wtq6s000cwabgjnlx5c0y	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-05 14:07:56.878	2025-09-05 14:07:56.878	cmf6wtq6s000awabg37g6dd4e
cmf9aqb7r0003waywu6togq7q	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-07 06:12:44.479	2025-09-07 06:12:44.479	cmf9aqb7q0001wayw0g484lfo
cmf9b5o7s0003wa5we1kxki7i	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-07 06:24:41.169	2025-09-07 06:24:41.169	cmf9b5o7r0001wa5wizota04d
cmfbdnekg0003wa5wodp37ilq	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-08 17:10:00.056	2025-09-08 17:10:00.056	cmfbdneke0001wa5wfdcgnthi
cmfbgba3k0003waw0t300qdjd	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-08 18:24:33.242	2025-09-08 18:24:33.242	cmfbgba3k0001waw0t5d1podz
cmfbnymmw0003wa6ojwbjmb97	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-08 21:58:39.889	2025-09-08 21:58:39.889	cmfbnymmu0001wa6o44brtbd7
cmfdc07cc0003wa4scalzwj5f	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-10 01:59:30.341	2025-09-10 01:59:30.341	cmfdc07cb0001wa4ssfeqjkgl
cmfdd18el000iwa4sk4onjyhe	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-10 02:28:17.997	2025-09-10 02:28:17.997	cmfdd18el000gwa4shywc2uaw
cmfddcj5l000xwa4sawdm79a7	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-10 02:37:05.145	2025-09-10 02:37:05.145	cmfddcj5l000vwa4s5ckur8nx
cmfdf36u4001cwa4s0p9dvly8	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-10 03:25:48.505	2025-09-10 03:25:48.505	cmfdf36u3001awa4smijlvoet
cmfr9kytk0003trao4jpgdwt9	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-19 20:00:26.692	2025-09-19 20:00:26.692	cmfr9kytk0001traoo7epylud
cmfr9olwk000atraop4ubcele	Sierra de Cubita Pozo de vilato #67	Camagüey	Camagüey	70100	Cuba	2025-09-19 20:03:16.58	2025-09-19 20:03:16.58	cmfr9olwk0008traobwzs8faz
cmfra1a9s000htraoyt7tximu	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-19 20:13:07.951	2025-09-19 20:13:07.951	cmfra1a9o000ftraoxgvqwgym
cmfradhmu000rtrao90g21467	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-09-19 20:22:37.443	2025-09-19 20:22:37.443	cmfradhmu000ptraobhienzws
cmfraq2rq0011trao61cf8lk3	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-09-19 20:32:24.71	2025-09-19 20:32:24.71	cmfraq2rq000ztraoq2stn73l
cmfrb1e57001atraoxes21kie	Sierra de Cubita Pozo de vilato #67	Camagüey	Camagüey	70100	Cuba	2025-09-19 20:41:12.66	2025-09-19 20:41:12.66	cmfrb1e570018trao7im015l7
cmfrbej6c0003trok41bz3dcz	Sierra de Cubita Pozo de vilato #67	Camagüey	Camagüey	70100	Cuba	2025-09-19 20:51:25.71	2025-09-19 20:51:25.71	cmfrbej6b0001trokkp07o8ts
cmfsda8lh0003trugzj9ut58f	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-20 14:31:50.777	2025-09-20 14:31:50.777	cmfsda8lg0001trugdw9pj79v
cmfyn9g1i0003cjasunoptzts	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-24 23:57:46.98	2025-09-24 23:57:46.98	cmfyn9g1i0001cjasutfnha24
cmfyomjjf000kcjasjq0h3vk9	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 00:35:57.657	2025-09-25 00:35:57.657	cmfyomjje000icjasunch1rzy
cmfypxiz30003cjngxtrim0fg	calle Antonio Jose #345	Cuba	Camaguey	12312	Cuba	2025-09-25 01:12:29.762	2025-09-25 01:12:29.762	cmfypxiz20001cjngt65vb8ce
cmfyrmjy80003cjhcy18seoi1	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 01:59:57.05	2025-09-25 01:59:57.05	cmfyrmjy70001cjhc2we0dxx1
cmfys666l0003cjp4aiyhsvo6	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 02:15:12.321	2025-09-25 02:15:12.321	cmfys666j0001cjp41hok8xwq
cmfyszg5q000icjp4no4z74es	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 02:37:58.095	2025-09-25 02:37:58.095	cmfyszg5e000gcjp4gyglhujo
cmfytde9d000xcjp4mgopggtp	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-09-25 02:48:48.985	2025-09-25 02:48:48.985	cmfytde9b000vcjp41htcaalj
cmfytmoqn001dcjp4nnkqld1g	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 02:56:02.495	2025-09-25 02:56:02.495	cmfytmoqn001bcjp4pi7inq3c
cmfzfvvaw0003cjt4n4tuwiu4	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 13:19:02.446	2025-09-25 13:19:02.446	cmfzfvvav0001cjt42pleqynm
cmfzgh2d80003cjq8kmk21ak2	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 13:35:31.384	2025-09-25 13:35:31.384	cmfzgh2d80001cjq8ei9nw8zo
cmfzh5ayc0003cjc08sb961w9	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-25 13:54:22.253	2025-09-25 13:54:22.253	cmfzh5ayb0001cjc0hwl8r6gb
cmg0y1am70003cjjk6dbng8al	calle f #33	Cuba	Cundinamarca	12312	Cuba	2025-09-26 14:34:54.842	2025-09-26 14:34:54.842	cmg0y1am60001cjjkxs0fu3g7
cmg0y83j6000icjjktsvhv0a9	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-26 14:40:12.249	2025-09-26 14:40:12.249	cmg0y83j6000gcjjkqmvq9qy7
cmg0z7ia9000xcjjkgdxxe6o5	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-26 15:07:44.322	2025-09-26 15:07:44.322	cmg0z7ia8000vcjjkr13b32oc
cmg10hgxj001ccjjkniq4cvxa	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-26 15:43:28.748	2025-09-26 15:43:28.748	cmg10hgxh001acjjk35emoyua
cmg163mjk0003cjksnyl98e1f	calle f #33	Cuba	Camaguey	12312	Cuba	2025-09-26 18:20:40.535	2025-09-26 18:20:40.535	cmg163mji0001cjksbn93u05t
cmg5u9jio0003cjg0fi01cb7r	Sierra de Cubita Pozo de vilato #67	Camagüey	Camagüey	70100	Cuba	2025-09-30 00:48:12.042	2025-09-30 00:48:12.042	cmg5u9jio0001cjg0tz3fxht3
cmgloz9yx0003cjgofwev2lmk	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-10-11 03:04:33.834	2025-10-11 03:04:33.834	cmgloz9yt0001cjgoxvwcb0h0
cmglxvmbe0003cjmw2lcclf9m	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-10-11 07:13:39.708	2025-10-11 07:13:39.708	cmglxvmbe0001cjmwaax5e6d9
cmgndtvmv000bcjmwwu0kjsf7	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-10-12 07:27:58.552	2025-10-12 07:27:58.552	cmgndtvmu0009cjmwwps07pzc
cmgndy4w1000icjmw7yyp1cv6	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-10-12 07:31:17.184	2025-10-12 07:31:17.184	cmgndy4w0000gcjmwg8r42gaj
cmgp53met0003cj3c9cxmg5z3	Calle 23 #2234	Cuba	Camaguey	12312	Cuba	2025-10-13 12:59:08.976	2025-10-13 12:59:08.976	cmgp53mes0001cj3c8vyc2d9j
\.


--
-- TOC entry 4952 (class 0 OID 16506)
-- Dependencies: 227
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, type, street, city, state, "zipCode", country, "isDefault", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- TOC entry 4953 (class 0 OID 16515)
-- Dependencies: 228
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "clerkId", email, "firstName", "lastName", avatar, role, "isActive", "createdAt", "updatedAt") FROM stdin;
cmehjl9wy0000wa0ox8dkfqrh	user_2zs7eVMG31XxaBxAu3cNG8FzsNQ	reyneldis537@gmail.com	reyneldis	umpierre	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yenM3ZVRLdzBtY1RjSEJoYVVZQTdEWjlBT0UifQ	ADMIN	t	2025-08-18 20:03:13.136	2025-08-20 22:13:06.86
cmeb0nzvp0000wa7g3if2r6a6	user_2z0skc678MCo8YzZ5FFqMTk96wS	neldis537@gmail.com	neldis	umpierre	https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvb2F1dGhfZ29vZ2xlL2ltZ18yejBza1pDQmk0UzM4bW5LNVBBTG0wRUxOUVcifQ	ADMIN	t	2025-08-14 06:26:50.337	2025-10-12 07:35:43.854
\.


--
-- TOC entry 4732 (class 2606 OID 16526)
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- TOC entry 4734 (class 2606 OID 16528)
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4740 (class 2606 OID 16530)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 4744 (class 2606 OID 16532)
-- Name: contact_info contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);


--
-- TOC entry 4782 (class 2606 OID 17605)
-- Name: email_metrics email_metrics_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_metrics
    ADD CONSTRAINT email_metrics_pkey PRIMARY KEY (id);


--
-- TOC entry 4746 (class 2606 OID 16534)
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- TOC entry 4750 (class 2606 OID 16536)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 4754 (class 2606 OID 16538)
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- TOC entry 4758 (class 2606 OID 16540)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 4767 (class 2606 OID 16542)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 4771 (class 2606 OID 16544)
-- Name: shipping_addresses shipping_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT shipping_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4774 (class 2606 OID 16546)
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- TOC entry 4779 (class 2606 OID 16548)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4735 (class 1259 OID 16550)
-- Name: cart_items_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cart_items_productId_idx" ON public.cart_items USING btree ("productId");


--
-- TOC entry 4736 (class 1259 OID 16551)
-- Name: cart_items_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cart_items_userId_idx" ON public.cart_items USING btree ("userId");


--
-- TOC entry 4737 (class 1259 OID 16552)
-- Name: cart_items_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON public.cart_items USING btree ("userId", "productId");


--
-- TOC entry 4738 (class 1259 OID 16553)
-- Name: categories_categoryName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "categories_categoryName_key" ON public.categories USING btree ("categoryName");


--
-- TOC entry 4741 (class 1259 OID 16554)
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- TOC entry 4742 (class 1259 OID 16555)
-- Name: contact_info_orderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "contact_info_orderId_key" ON public.contact_info USING btree ("orderId");


--
-- TOC entry 4780 (class 1259 OID 17606)
-- Name: email_metrics_orderId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "email_metrics_orderId_idx" ON public.email_metrics USING btree ("orderId");


--
-- TOC entry 4747 (class 1259 OID 16556)
-- Name: orders_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orders_createdAt_idx" ON public.orders USING btree ("createdAt");


--
-- TOC entry 4748 (class 1259 OID 16557)
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- TOC entry 4751 (class 1259 OID 16558)
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- TOC entry 4752 (class 1259 OID 16559)
-- Name: orders_userId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orders_userId_status_idx" ON public.orders USING btree ("userId", status);


--
-- TOC entry 4755 (class 1259 OID 16560)
-- Name: products_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_categoryId_idx" ON public.products USING btree ("categoryId");


--
-- TOC entry 4756 (class 1259 OID 16561)
-- Name: products_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_createdAt_idx" ON public.products USING btree ("createdAt");


--
-- TOC entry 4759 (class 1259 OID 16562)
-- Name: products_price_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_price_idx ON public.products USING btree (price);


--
-- TOC entry 4760 (class 1259 OID 17607)
-- Name: products_productName_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_productName_idx" ON public.products USING btree ("productName");


--
-- TOC entry 4761 (class 1259 OID 16563)
-- Name: products_searchText_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_searchText_idx" ON public.products USING gin ("searchText");


--
-- TOC entry 4762 (class 1259 OID 16564)
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- TOC entry 4763 (class 1259 OID 16565)
-- Name: products_status_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_status_featured_idx ON public.products USING btree (status, featured);


--
-- TOC entry 4764 (class 1259 OID 16566)
-- Name: reviews_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_createdAt_idx" ON public.reviews USING btree ("createdAt");


--
-- TOC entry 4765 (class 1259 OID 16567)
-- Name: reviews_isApproved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_isApproved_idx" ON public.reviews USING btree ("isApproved");


--
-- TOC entry 4768 (class 1259 OID 16568)
-- Name: reviews_productId_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_productId_rating_idx" ON public.reviews USING btree ("productId", rating);


--
-- TOC entry 4769 (class 1259 OID 16569)
-- Name: shipping_addresses_orderId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "shipping_addresses_orderId_key" ON public.shipping_addresses USING btree ("orderId");


--
-- TOC entry 4772 (class 1259 OID 16570)
-- Name: user_addresses_isDefault_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_addresses_isDefault_idx" ON public.user_addresses USING btree ("isDefault");


--
-- TOC entry 4775 (class 1259 OID 16571)
-- Name: user_addresses_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_addresses_userId_idx" ON public.user_addresses USING btree ("userId");


--
-- TOC entry 4776 (class 1259 OID 16572)
-- Name: users_clerkId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_clerkId_key" ON public.users USING btree ("clerkId");


--
-- TOC entry 4777 (class 1259 OID 16573)
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- TOC entry 4796 (class 2620 OID 16574)
-- Name: products tsvectorupdate; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER tsvectorupdate BEFORE INSERT OR UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_products_search_text();


--
-- TOC entry 4783 (class 2606 OID 16580)
-- Name: cart_items cart_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4784 (class 2606 OID 16585)
-- Name: cart_items cart_items_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4785 (class 2606 OID 16590)
-- Name: contact_info contact_info_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT "contact_info_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4795 (class 2606 OID 17608)
-- Name: email_metrics email_metrics_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.email_metrics
    ADD CONSTRAINT "email_metrics_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4786 (class 2606 OID 16595)
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4787 (class 2606 OID 16600)
-- Name: order_items order_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4788 (class 2606 OID 16605)
-- Name: orders orders_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- TOC entry 4789 (class 2606 OID 16610)
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4790 (class 2606 OID 16615)
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4791 (class 2606 OID 16620)
-- Name: reviews reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4792 (class 2606 OID 16625)
-- Name: reviews reviews_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4793 (class 2606 OID 16630)
-- Name: shipping_addresses shipping_addresses_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shipping_addresses
    ADD CONSTRAINT "shipping_addresses_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4794 (class 2606 OID 16635)
-- Name: user_addresses user_addresses_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT "user_addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4961 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


-- Completed on 2025-10-25 13:55:23

--
-- PostgreSQL database dump complete
--

\unrestrict vh1iYyoYKAYdEAAh507PtOYla2kDB70LzgrZPEuNzoDGz874aqCQ4VKqkppsVYm

