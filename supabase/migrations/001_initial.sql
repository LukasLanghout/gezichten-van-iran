-- Tables
create table if not exists stories (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  city text not null,
  country text not null,
  story_text text not null,
  photo_url text,
  status text not null default 'pending',
  created_at timestamp with time zone default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  story_id uuid references stories(id),
  sender_name text not null,
  message text not null,
  created_at timestamp with time zone default now()
);

create table if not exists qr_scans (
  id uuid primary key default gen_random_uuid(),
  scanned_at timestamp with time zone default now()
);

-- Seed data
insert into stories (first_name, city, country, story_text, photo_url, status) values
(
  'Parisa',
  'Teheran',
  'Iran',
  'Ik stond in de rij bij de bakker toen de eerste explosie klonk. Niet ver weg — je voelt het in je borst, alsof de lucht even stopt. Iedereen keek elkaar aan, maar niemand bewoog. De bakker pakte mijn brood in alsof er niets was. Dat is hoe je overleeft: je doet gewoon door. Mijn kinderen waren thuis bij mijn moeder. Ik belde haar meteen, maar het netwerk was overbelast. Tien minuten lang wist ik niet of ze veilig waren. Toen ik eindelijk doorkreeg dat alles goed was, stond ik midden op straat te huilen terwijl mensen me voorbijliepen met hun boodschappentassen. Dat is het leven hier nu.',
  'https://picsum.photos/seed/iran1/800/600',
  'approved'
),
(
  'Dariush',
  'Amsterdam',
  'Nederland',
  'Ik zit hier in Amsterdam met mijn koffie en kijk op mijn telefoon hoe mijn geboorteland instort. Mijn zus belt elke avond — soms lukt het, soms niet. Als ze niet opneemt, begint mijn hart sneller te kloppen en stop ik pas met piekeren als ik haar stem hoor. Mijn Nederlandse vrienden vragen wat ze kunnen doen. Eerlijk gezegd weet ik het niet. Luisteren helpt al. Niet wegkijken van het nieuws helpt. Ik ben hier veilig, en dat schuldgevoel draag ik elke dag mee. Mijn ouders willen niet weg — dit is hun thuis. Ik respecteer dat, maar het maakt het er niet makkelijker op.',
  'https://picsum.photos/seed/iran2/800/600',
  'approved'
),
(
  'Leila',
  'Isfahan',
  'Iran',
  'Mijn dochter heeft gisteren haar eerste stap gezet. Ik heb haar gefilmd en het filmpje honderd keer bekeken. Even was de wereld alleen maar dit: haar kleine voetje dat het losliet, haar stralende gezicht. Buiten is het ingewikkeld. Maar binnenshuis probeer ik dat te beschermen — haar lach, onze routines, de thee om vier uur. Mensen vragen me hoe ik hier nog normaal kan leven. Maar wat is het alternatief? Stoppen met leven totdat het voorbij is? Dat kan niet. Mijn moeder heeft drie oorlogen meegemaakt. Ze zei altijd: je went er niet aan, maar je leert ermee te leven. Ik begrijp nu wat ze bedoelde.',
  'https://picsum.photos/seed/iran3/800/600',
  'approved'
);
