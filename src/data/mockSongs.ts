import { Song } from '../types';

export const mockSongs: Song[] = [
  {
    id: '1',
    title: 'Imagine',
    artist: 'John Lennon',
    genre: 'Rock',
    originalKey: 'C',
    difficulty: 'beginner',
    lyrics: `[C]Imagine there's no [F]heaven
[C]It's easy if you [F]try
[C]No hell be[F]low us
[C]Above us only [F]sky

[Am7]Imagine all the [Dm]people [F]living for to[G]day

[C]Imagine there's no [F]countries
[C]It isn't hard to [F]do
[C]Nothing to kill or [F]die for
[C]And no religion [F]too

[Am7]Imagine all the [Dm]people [F]living life in [G]peace

You may [F]say I'm a [Am7]dreamer [Dm] [F]
But I'm [F]not the only [Am7]one [Dm] [F]
I [F]hope someday you'll [Am7]join us [Dm] [F]
And the [F]world will [G]be as [C]one`,
    tablature: `e|--0--0--0--0--|
B|--1--1--1--1--|
G|--0--0--2--2--|
D|--2--2--3--3--|
A|--3--3--3--3--|
E|--x--x--x--x--|
   C     F`,
    authorId: 'demo-user',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    views: 1250,
    likes: 89
  },
  {
    id: '2',
    title: 'Wonderwall',
    artist: 'Oasis',
    genre: 'Rock',
    originalKey: 'G',
    difficulty: 'intermediate',
    lyrics: `[Em7]Today is [G]gonna be the day that they're [D]gonna throw it back to [C]you
[Em7]By now you [G]should've somehow real[D]ized what you gotta [C]do
[Em7]I don't believe that [G]anybody [D]feels the way I [C]do about you [D]now

[C]Backbeat the [D]word was on the [Em7]street that [G]fire in your [C]heart is [D]out
[C]I'm sure you've [D]heard it all be[Em7]fore but you [G]never really [C]had a [D]doubt
[C]I don't believe that [D]anybody [Em7]feels the way I [C]do about you [D]now

And [C]all the roads we [D]have to walk are [Em7]winding
And [C]all the lights that [D]lead us there are [Em7]blinding
[C]There are many [D]things that I would [G]like to [D/F#]say to [Em7]you
But I don't know [A]how

Because [C]maybe [Em7] [G]
You're [Em7]gonna be the one that [C]saves [Em7]me [G]
And [C]after [Em7]all [G]
You're my [Em7]wonder[C]wall [Em7] [G]`,
    authorId: 'demo-user',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    views: 2150,
    likes: 156
  },
  {
    id: '3',
    title: 'Águas de Março',
    artist: 'Tom Jobim',
    genre: 'MPB',
    originalKey: 'C',
    difficulty: 'advanced',
    lyrics: `[C]É pau, é pe[F]dra, é o fim do ca[C]minho
É um resto de [G7]toco, é um pouco so[C]zinho
É um caco de [F]vidro, é a vida, é o [C]sol
É a noite, é a [G7]morte, é um laço, é o an[C]zol

[F]É peroba do [C]campo, é o nó da ma[G7]deira
[Em7]Caingá, can[Am7]deia, é o matita pe[G7]reira
[C]É madeira de [F]vento, tombo da ri[C]beira
É o mistério pro[G7]fundo, é o queira ou não [C]queira

[C]É o vento ven[F]tando, é o fim da la[C]deira
É a viga, é o [G7]vão, festa da cu[C]meeira
É a chuva chu[F]vendo, é conversa ri[C]beira
Das águas de [G7]março, é o fim da can[C]seira

É o pé, é o [F]chão, é a marcha es[C]tradeira
Passarinho na [G7]mão, pedra de ati[C]radeira`,
    authorId: 'demo-user',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    views: 890,
    likes: 67
  },
  {
    id: '4',
    title: 'Hotel California',
    artist: 'Eagles',
    genre: 'Rock',
    originalKey: 'A',
    difficulty: 'intermediate',
    lyrics: `[Am]On a dark desert [E7]highway, [G]cool wind in my [D]hair
[F]Warm smell of co[C]litas, [Dm7]rising up through the [E7]air
[Am]Up ahead in the [E7]distance, [G]I saw a shimmering [D]light
[F]My head grew heavy and my [C]sight grew dim
[Dm7]I had to stop for the [E7]night

[Am]There she stood in the [E7]doorway
[G]I heard the mission [D]bell
[F]And I was thinking to my[C]self
This could be [Dm7]heaven or this could be [E7]hell
[Am]Then she lit up a [E7]candle
[G]And she showed me the [D]way
[F]There were voices down the [C]corridor
[Dm7]I thought I heard them [E7]say

[F]Welcome to the Hotel Cali[C]fornia
Such a [E7]lovely place (Such a lovely place)
Such a [Am]lovely face
[F]Plenty of room at the Hotel Cali[C]fornia
Any [Dm7]time of year (Any time of year)
You can [E7]find it here`,
    authorId: 'demo-user',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-05'),
    views: 1850,
    likes: 134
  },
  {
    id: '5',
    title: 'Evidências',
    artist: 'Chitãozinho & Xororó',
    genre: 'Sertanejo',
    originalKey: 'G',
    difficulty: 'beginner',
    lyrics: `[G]Quando eu digo que [Em7]deixei de te [C]amar
É porque eu te [Am7]amo [D]
[G]Quando eu digo que [Em7]não quero mais [C]você
É porque eu te [Am7]quero [D]
[Em7]Eu tenho medo de te [Bm7]dar meu coração
[C]E confessar que eu [G]estou [D]em suas [Em7]mãos [D]

[G]Mas não posso ima[Em7]ginar
O que vai ser de [C]mim
Se eu te [Am7]perder um [D]dia
[G]Eu me alegro [Em7]falsamente
E me [C]entrego
[Am7]Inteira[D]mente

[C]Vem meu bem, de uma vez
[Bm7]Me diz que me ama [Em7]também [Am7] [D]
[C]Vem meu bem, de uma vez
[Bm7]Me diz que me ama [Em7]também [Am7]
E me [D]beija a [G]boca`,
    authorId: 'demo-user',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-03'),
    views: 3250,
    likes: 298
  }
];