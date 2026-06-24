-- Voeg kinderbrief-kolom toe aan stories
ALTER TABLE stories ADD COLUMN IF NOT EXISTS child_letter text;

-- Seed kinderbrieven voor de drie bestaande verhalen
UPDATE stories SET child_letter = 'Lieve Parisa,

Ik heet Emma en ik ben 10 jaar. Mijn juf heeft ons jouw verhaal laten lezen. Ik schrok er een beetje van, want ik dacht dat explosies alleen in films waren.

Ik vind het heel dapper dat je gewoon doorging met je dag. Als ik iets eng hoor, verstop ik me onder mijn dekbed. Maar misschien is doorgaan ook een soort moed.

Ik hoop dat het nu rustig is bij de bakker en dat je lekker brood hebt kunnen kopen.

Liefs,
Emma (klas 5)'
WHERE first_name = 'Parisa' AND city = 'Teheran';

UPDATE stories SET child_letter = 'Lieve Dariush,

Ik heet Luca en ik ben 11. Ik woon in Amsterdam net als jij! Misschien hebben we elkaar wel eens gezien.

Mijn mama zegt dat ik altijd moet luisteren naar mensen die verdriet hebben. Dus ik luister naar jou. Ik vind het erg dat je zusje soms niet opneemt en dat je dan bang bent.

Mijn grote broer woont in Utrecht en als hij niet belt word ik ook een beetje ongerust. Maar dat is maar een half uur rijden, niet zoals bij jou.

Ik hoop dat je zusje altijd snel opneemt.

Groetjes,
Luca'
WHERE first_name = 'Dariush' AND city = 'Amsterdam';

UPDATE stories SET child_letter = 'Lieve Leila,

Ik heet Noor en ik ben 9 jaar. Ik heb een filmpje gemaakt toen mijn broertje voor het eerst liep en dat vind ik het liefste filmpje dat ik heb.

Ik begrijp dat je dat ook hebt bij je dochter. Die eerste stap is iets bijzonders hè? Mijn moeder huilde er ook bij.

Mijn oma zegt dat je altijd iets moois moet zoeken in een moeilijke dag. Net als jij met je thee om vier uur. Ik drink altijd warme chocolademelk als ik verdrietig ben.

Ik hoop dat je dochter nog heel veel eerste keren beleeft.

Liefs,
Noor'
WHERE first_name = 'Leila' AND city = 'Isfahan';
