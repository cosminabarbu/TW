DROP TYPE IF EXISTS categ_bijuterie;
DROP TYPE IF EXISTS tipuri_produse;

CREATE TYPE categ_bijuterie AS ENUM('toate','pentru ea', 'pentru el', 'bebelusi', 'editie aniversara', 'ocazii speciale');
CREATE TYPE tipuri_produse AS ENUM('toate', 'colier', 'bratara', 'cercei', 'inel');

CREATE TABLE IF NOT EXISTS bijuterii(
    id serial PRIMARY KEY,
    nume VARCHAR(60) UNIQUE NOT NULL,
    descriere TEXT,
    pret NUMERIC(8,2) NOT NULL,
    gramaj INT NOT NULL CHECK (gramaj>0),
    tip_produs tipuri_produse DEFAULT 'toate',
    material VARCHAR(60) NOT NULL,
    reglabil BOOLEAN NOT NULL DEFAULT FALSE,
    categorie categ_bijuterie DEFAULT 'toate',
    imagine VARCHAR(300),
    data_adaugare TIMESTAMP DEFAULT current_timestamp
);

INSERT into bijuterii(nume, descriere, pret, gramaj, tip_produs, material, reglabil, categorie, imagine) VALUES
('Colier TW', 'Colie Tennis cu pietre prețioase', 300, 270, 'colier', '{"argint", "zirconiu"}', True, 'pentru ea', 'rsz_logodna-trandafir.jpg'),
('Cercei rotunzi', 'Cercei rotunzi pentru bebeluși', 500, 160, 'cercei','{"aur", "aur alb", "pietre semiprețioase"}', False, 'bebelusi', 'bebelusi-rotunzi.jpg'),
('Cercei cu floricele', 'Cercei rotunzi cu model de floricele pentru bebeluși', 320, 200,'cercei','aur', False, 'bebelusi', 'bebelusi-floricica.jpg'),
('Cercei cu steluțe', 'Cercei cu tijă cu model de steluțe pentru bebeluși', 290, 175, 'cercei', 'aur',False, 'bebelusi', 'bebelusi-steluta.jpg' ),
('Inel BlueDream', 'Inel de logodnă cu diamant albastru', 1060, 400, 'inel', '{"aur alb", "diamant"}', False, 'ocazii speciale', 'logodna-rotund-albastru.jpg'),  
('Inel OLove', 'Inel de logodnă cu diamante dispuse octogonal și de-a lungul benzii', 1720, 560, 'inel', '{"aur alb", "diamant"}', False, 'pentru ea', 'logodna-octogon.jpg'),
('Brățară LSTAR', 'Brățară de picior cu pandantiv în formă de steluță', 200, 300, 'bratara', 'aur', False, 'pentru ea', 'picior-steluta.jpg' ),
('Brățară Perlais', 'Brățară de picior cu perle de cultură', 300, 270, 'bratara', 'argint', False, 'pentru ea', 'picior-perle.jpg' )





;




GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO cosmina;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO cosmina;