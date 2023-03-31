CREATE TABLE stripe_products (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    description text,
    stripe_product_id text NOT NULL UNIQUE,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone,
    is_active boolean NOT NULL
);

CREATE TABLE request_log (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at timestamp without time zone NOT NULL DEFAULT now(),
    endpoint text,
    base_url text,
    method text,
    status_code text,
    status text,
    ip_address text
);