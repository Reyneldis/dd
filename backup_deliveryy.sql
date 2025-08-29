--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS '';


--
-- Name: AddressType; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."AddressType" AS ENUM (
    'HOME',
    'WORK',
    'OTHER'
);


ALTER TYPE public."AddressType" OWNER TO postgres;

--
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
-- Name: Role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Role" AS ENUM (
    'USER',
    'ADMIN',
    'SUPER_ADMIN'
);


ALTER TYPE public."Role" OWNER TO postgres;

--
-- Name: Status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public."Status" AS ENUM (
    'ACTIVE',
    'INACTIVE'
);


ALTER TYPE public."Status" OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
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
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id text NOT NULL,
    "orderNumber" text NOT NULL,
    "userId" text NOT NULL,
    status public."OrderStatus" DEFAULT 'PENDING'::public."OrderStatus" NOT NULL,
    "customerEmail" text,
    "customerName" text,
    subtotal double precision NOT NULL,
    "taxAmount" double precision DEFAULT 0 NOT NULL,
    "shippingAmount" double precision DEFAULT 0 NOT NULL,
    total double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "shippingAddress" jsonb
);


ALTER TABLE public.orders OWNER TO postgres;

--
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
    status public."Status" DEFAULT 'ACTIVE'::public."Status" NOT NULL
);


ALTER TABLE public.products OWNER TO postgres;

--
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
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
669cf6dd-f1c3-4674-9512-e6cf7c4290d4	5da1e0bce0ead8cae5bd749273604add18846cbbd24c39b05fb0a7341d9e114a	2025-07-20 20:02:42.200635-04	20250706235913_init	\N	\N	2025-07-20 20:02:42.179844-04	1
358ee789-842b-4d0e-9f31-815266f8b2a4	79b13aae1ad344820b811c8404d71ade9a2d961679121b9027389e98caecb173	2025-07-20 20:02:42.331584-04	20250707004934_simplified_schema	\N	\N	2025-07-20 20:02:42.202-04	1
cdd034c2-6a6e-4854-b087-c42bd3b56027	ab777e6757ebdf647fb56aa9888e8c2db2bf31356e2a0a2fe0847c4ef28ca174	2025-07-20 20:02:42.335749-04	20250707054705_add_user_is_active	\N	\N	2025-07-20 20:02:42.332444-04	1
6491901f-1910-4c82-8fe7-b691e2a2a6e8	d64345fd34a4184045f85fcc54cc973375cb58df115cd421d86e3c3871af7edf	2025-07-20 20:02:42.340828-04	20250708061235_add_product_status	\N	\N	2025-07-20 20:02:42.336659-04	1
d02b8a87-f100-42a7-939a-c68d83d3c471	d1c0779d22e1d6f663f997a9a2bf274658f76a6a8ce01867f0425cfa4af1fa48	2025-07-20 20:02:42.345428-04	20250713121744_add_featured_to_product	\N	\N	2025-07-20 20:02:42.341654-04	1
6dc9d945-b6f7-4c84-a1d7-f984ef9c7623	73ab24c1ae0759f302de0749577070577e68750ef78c7ed0ce8351ac330a6ff4	2025-07-20 20:02:42.359787-04	20250714153707_nuevo	\N	\N	2025-07-20 20:02:42.346672-04	1
8151c835-2ae2-4ad5-bf3b-b189d16089a0	04b77e477f52629def62df55f12c329824ca94f2c0b6293a65682aecabf8607d	2025-07-20 20:02:42.372356-04	20250716044228_add_payment_intent_id_to_order_optional	\N	\N	2025-07-20 20:02:42.361359-04	1
ca20e7a1-2348-4010-9b80-6179ec54fbec	083b3e676c7a95bb00263458e9a3da656d570aed21c7565cf7de1158d473be58	2025-07-20 20:02:42.380481-04	20250716063710_add_shipping_billing_address_to_order	\N	\N	2025-07-20 20:02:42.373581-04	1
1f84b0f0-6289-41bb-81a0-5ee6ee86d8ef	adbe764c2e377bcad55d7e77f14f02889163ae83e06837af357b96bb1e07b9da	2025-07-20 20:02:42.38943-04	20250717053730_add_failed_to_order_status	\N	\N	2025-07-20 20:02:42.382097-04	1
c7057676-270f-45e8-9bdf-069828a54fde	d0252a25ba4d7195ba79dac6bccf7699ce9f5ed78809300bf90bc1c91898e759	2025-07-20 20:24:57.538835-04	20250721002457_fix_archived_orders	\N	\N	2025-07-20 20:24:57.404354-04	1
ee2c8048-ff4d-436c-bc08-6f8104946a5a	3da47acb05e41650fa14a761a5a0ee3af9cd1a833c18b47ac78e7ad70999506a	2025-07-29 08:03:23.00028-04	20250729120322_add_indexes	\N	\N	2025-07-29 08:03:22.859684-04	1
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cart_items (id, "userId", "productId", quantity, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, "categoryName", slug, "mainImage", description, "createdAt", "updatedAt") FROM stdin;
cmdcf6n280004wajosj52yx60	Aseos	aseos	/img/categories/1753060878169.webp	Productos para el aseo del hogar	2025-07-21 01:21:18.656	2025-07-21 01:21:18.656
cmdcf8twr0005wajo8l27pu9e	Comida	comida	/img/categories/1753060977900.webp	Productos para la alimentación de tu hogar	2025-07-21 01:23:00.843	2025-07-21 01:23:00.843
cmdcf5mub0003wajosh7akb0r	Electródomesticos	electrodomesticos	/img/categories/1753060814949.webp	Producto electrodomésticos para tu hogar	2025-07-21 01:20:31.715	2025-07-21 01:23:39.151
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.order_items (id, "orderId", "productId", "productName", "productSku", price, quantity, total, "createdAt") FROM stdin;
cmdo6vhk50007waagdoupt7qx	cmdo6vhk50005waag2n5c3vqo	cmdcfik2x000dwajo0hivk412	Café la llave	cmdcfik2x000dwajo0hivk412	4.33	1	4.33	2025-07-29 07:01:55.493
cmdo6vhk70008waagpybb8bd9	cmdo6vhk50005waag2n5c3vqo	cmdf8am4i0001wabs972s6jvo	Salchichas	cmdf8am4i0001wabs972s6jvo	4.99	1	4.99	2025-07-29 07:01:55.493
cmdo8349h000cwaagk3p9qwqh	cmdo8349e000awaagp2yh7l6l	cmdcfgx06000awajo4819hjd3	cafe	cmdcfgx06000awajo4819hjd3	4.99	1	4.99	2025-07-29 07:35:51.113
cmdo8349h000dwaagt2p1mpag	cmdo8349e000awaagp2yh7l6l	cmdcfdy2f0007wajo0rgrak07	Pollo	cmdcfdy2f0007wajo0rgrak07	12.33	1	12.33	2025-07-29 07:35:51.113
cmds8iuld0006wa6806gyxzdv	cmds8iuld0004wa68598az032	cmds8ex7a0001wa687edv9r8s	Detergente en polvo	cmds8ex7a0001wa687edv9r8s	1.99	1	1.99	2025-08-01 02:59:09.793
cmds8wvj1000awa6886f5btnu	cmds8wvj00008wa68c3twu8lo	cmds8ex7a0001wa687edv9r8s	Detergente en polvo	cmds8ex7a0001wa687edv9r8s	1.99	1	1.99	2025-08-01 03:10:04.188
cmdsecwm50003wa7svr2b5bts	cmdsecwm50001wa7se9px8zaq	cmds7q7rs0001wadghlyxl8ag	Cafetera	cmds7q7rs0001wadghlyxl8ag	3.99	1	3.99	2025-08-01 05:42:30.164
cmdseooov0007wa7s772hkh2a	cmdseooov0005wa7srnkytz9b	cmds7q7rs0001wadghlyxl8ag	Cafetera	cmds7q7rs0001wadghlyxl8ag	3.99	1	3.99	2025-08-01 05:51:39.775
cmdsety2f000bwa7sxwuvplsb	cmdsety2f0009wa7saxtzqusi	cmds7q7rs0001wadghlyxl8ag	Cafetera	cmds7q7rs0001wadghlyxl8ag	3.99	1	3.99	2025-08-01 05:55:45.207
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "orderNumber", "userId", status, "customerEmail", "customerName", subtotal, "taxAmount", "shippingAmount", total, "createdAt", "updatedAt", "shippingAddress") FROM stdin;
cmdo6vhk50005waag2n5c3vqo	ORD-515492	342327d8-6682-4d13-aac7-ab32c94d6673	FAILED	reyneldis537@gmail.com	umpi	9.32	0	0	9.32	2025-07-29 07:01:55.493	2025-07-29 07:24:23.609	{"phone": "+5359597421", "address": "Calle Mendive, Camagüey, Cuba"}
cmdo8349e000awaagp2yh7l6l	ORD-551088	342327d8-6682-4d13-aac7-ab32c94d6673	PROCESSING	reyneldis537@gmail.com	Pepe	17.32	0	0	17.32	2025-07-29 07:35:51.113	2025-07-29 08:25:22.939	{"phone": "+5359597421", "address": "Calle mm #45, Cuba"}
cmds8iuld0004wa68598az032	ORD-149789	342327d8-6682-4d13-aac7-ab32c94d6673	PENDING	reyneldis537@gmail.com	reyneldis	1.99	0	0	1.99	2025-08-01 02:59:09.793	2025-08-01 02:59:09.793	{"phone": "5359597421", "address": "Calle mm#45, Cuba"}
cmds8wvj00008wa68c3twu8lo	ORD-804182	342327d8-6682-4d13-aac7-ab32c94d6673	PENDING	reyneldis537@gmail.com	eliza	1.99	0	0	1.99	2025-08-01 03:10:04.188	2025-08-01 03:10:04.188	{"phone": "+5359597532", "address": "Calee f #33, Cuba"}
cmdsecwm50001wa7se9px8zaq	ORD-950152	342327d8-6682-4d13-aac7-ab32c94d6673	PENDING	reyneldis537@gmail.com	Eliza	3.99	0	0	3.99	2025-08-01 05:42:30.164	2025-08-01 05:42:30.164	{"phone": "+5359597423", "address": "calle f #33, cuba"}
cmdseooov0005wa7srnkytz9b	ORD-499769	342327d8-6682-4d13-aac7-ab32c94d6673	PENDING	reyneldis537@gmail.com	Eliza	3.99	0	0	3.99	2025-08-01 05:51:39.775	2025-08-01 05:51:39.775	{"phone": "+5359597423", "address": "calle f #33 cuba"}
cmdsety2f0009wa7saxtzqusi	ORD-745203	342327d8-6682-4d13-aac7-ab32c94d6673	PENDING	rey@gamil.com	rey	3.99	0	0	3.99	2025-08-01 05:55:45.207	2025-08-01 05:55:45.207	{"phone": "+5359597424", "address": "calle f #33 cuba"}
\.


--
-- Data for Name: product_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.product_images (id, "productId", url, alt, "sortOrder", "isPrimary", "createdAt") FROM stdin;
cmdcfdy2i0008wajoa5qvtfiz	cmdcfdy2f0007wajo0rgrak07	/img/products/1753061217902.webp	Pollo	0	t	2025-07-21 01:26:59.505
cmdcfgx07000bwajoguhx88su	cmdcfgx06000awajo4819hjd3	/img/products/1753061356760.webp	cafe	0	t	2025-07-21 01:29:18.103
cmdcfik2x000ewajotntv0p6r	cmdcfik2x000dwajo0hivk412	/img/products/1753061431936.webp	Café la llave	0	t	2025-07-21 01:30:34.664
cmdf8am4j0002wabsk7lggd77	cmdf8am4i0001wabs972s6jvo	/img/products/1753230702733.webp	Salchichas	0	t	2025-07-23 00:31:45.281
cmds7q7rs0002wadgy62ewsno	cmds7q7rs0001wadghlyxl8ag	/img/products/1754015803664.webp	Cafetera	0	t	2025-08-01 02:36:53.848
cmds8ex7a0002wa68jxkgw7lq	cmds8ex7a0001wa687edv9r8s	/img/products/1754016957485.webp	Detergente en polvo	0	t	2025-08-01 02:56:06.55
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, slug, "productName", price, description, "categoryId", "createdAt", "updatedAt", featured, features, status) FROM stdin;
cmdcfdy2f0007wajo0rgrak07	pollo	Pollo	12.33	Caja de pollo	cmdcf8twr0005wajo8l27pu9e	2025-07-21 01:26:59.505	2025-07-31 15:32:17.364	t	\N	ACTIVE
cmdcfgx06000awajo4819hjd3	cafe	cafe	4.99	Café Serrano	cmdcf8twr0005wajo8l27pu9e	2025-07-21 01:29:18.103	2025-07-31 15:32:17.364	t	\N	ACTIVE
cmdcfik2x000dwajo0hivk412	cafeLaLLave	Café la llave	4.33	Café la llave	cmdcf8twr0005wajo8l27pu9e	2025-07-21 01:30:34.664	2025-07-31 15:32:17.364	t	\N	ACTIVE
cmdf8am4i0001wabs972s6jvo	salchichas	Salchichas	4.99	Salchichas de pollo	cmdcf8twr0005wajo8l27pu9e	2025-07-23 00:31:45.281	2025-07-31 15:32:17.364	t	\N	ACTIVE
cmds7q7rs0001wadghlyxl8ag	cafetera	Cafetera	3.99	Cafetera Eléctrica	cmdcf5mub0003wajosh7akb0r	2025-08-01 02:36:53.848	2025-08-01 02:36:53.848	f	\N	ACTIVE
cmds8ex7a0001wa687edv9r8s	detergente-en-polvo	Detergente en polvo	1.99	detergente en polvo omo	cmdcf6n280004wajosj52yx60	2025-08-01 02:56:06.55	2025-08-01 02:56:06.55	t	\N	ACTIVE
\.


--
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, "userId", "productId", rating, comment, "isApproved", "createdAt", "updatedAt") FROM stdin;
cmdgh2wiv0003wabo917chxym	626d8689-9da0-41e1-a33a-a618a7228aa0	cmdcfgx06000awajo4819hjd3	5	La calidad de los productos es increíble y los precios muy competitivos. El proceso de compra fue súper fácil y rápido.	t	2025-07-23 21:25:28.232	2025-07-29 21:16:06.286
cmdp1b93d0001wa14fu1o90zd	342327d8-6682-4d13-aac7-ab32c94d6673	cmdcfdy2f0007wajo0rgrak07	5	Recibí mi pedido en menos de 24 horas y todo llegó en perfecto estado. Definitivamente volveré a comprar aquí.	t	2025-07-29 21:13:59.496	2025-07-29 21:16:06.286
cmdp1b9fr0003wa144jlc73xy	626d8689-9da0-41e1-a33a-a618a7228aa0	cmdf8am4i0001wabs972s6jvo	5	Compré productos de limpieza y quedé muy satisfecho. La entrega fue rápida y los productos son de excelente calidad.	t	2025-07-29 21:13:59.498	2025-07-29 21:16:06.29
cmdhomw670001wa3wr7c6zpq2	342327d8-6682-4d13-aac7-ab32c94d6673	cmdcfik2x000dwajo0hivk412	4	Me encantó la atención al cliente. Resolvieron todas mis dudas rápidamente y el envío fue muy puntual. ¡Altamente recomendado!	t	2025-07-24 17:44:44.376	2025-07-29 21:16:06.286
\.


--
-- Data for Name: user_addresses; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_addresses (id, type, street, city, state, "zipCode", country, "isDefault", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, "clerkId", email, "firstName", "lastName", avatar, role, "isActive", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_images product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT product_images_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- Name: user_addresses user_addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_addresses
    ADD CONSTRAINT user_addresses_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: cart_items_productId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cart_items_productId_idx" ON public.cart_items USING btree ("productId");


--
-- Name: cart_items_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "cart_items_userId_idx" ON public.cart_items USING btree ("userId");


--
-- Name: cart_items_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "cart_items_userId_productId_key" ON public.cart_items USING btree ("userId", "productId");


--
-- Name: categories_categoryName_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "categories_categoryName_key" ON public.categories USING btree ("categoryName");


--
-- Name: categories_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX categories_slug_key ON public.categories USING btree (slug);


--
-- Name: orders_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orders_createdAt_idx" ON public.orders USING btree ("createdAt");


--
-- Name: orders_orderNumber_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "orders_orderNumber_key" ON public.orders USING btree ("orderNumber");


--
-- Name: orders_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX orders_status_idx ON public.orders USING btree (status);


--
-- Name: orders_userId_status_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "orders_userId_status_idx" ON public.orders USING btree ("userId", status);


--
-- Name: products_categoryId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_categoryId_idx" ON public.products USING btree ("categoryId");


--
-- Name: products_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "products_createdAt_idx" ON public.products USING btree ("createdAt");


--
-- Name: products_price_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_price_idx ON public.products USING btree (price);


--
-- Name: products_slug_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX products_slug_key ON public.products USING btree (slug);


--
-- Name: products_status_featured_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX products_status_featured_idx ON public.products USING btree (status, featured);


--
-- Name: reviews_createdAt_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_createdAt_idx" ON public.reviews USING btree ("createdAt");


--
-- Name: reviews_isApproved_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_isApproved_idx" ON public.reviews USING btree ("isApproved");


--
-- Name: reviews_productId_rating_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "reviews_productId_rating_idx" ON public.reviews USING btree ("productId", rating);


--
-- Name: reviews_userId_productId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "reviews_userId_productId_key" ON public.reviews USING btree ("userId", "productId");


--
-- Name: user_addresses_isDefault_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_addresses_isDefault_idx" ON public.user_addresses USING btree ("isDefault");


--
-- Name: user_addresses_userId_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "user_addresses_userId_idx" ON public.user_addresses USING btree ("userId");


--
-- Name: users_clerkId_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX "users_clerkId_key" ON public.users USING btree ("clerkId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: postgres
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: cart_items cart_items_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: order_items order_items_orderId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES public.orders(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: product_images product_images_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.product_images
    ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: products products_categoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT "products_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES public.categories(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: reviews reviews_productId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES public.products(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

