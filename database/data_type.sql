CREATE TYPE public.account_type AS ENUM
    ('client', 'employee', 'admin');

ALTER TYPE public.account_type
    OWNER TO cse340;