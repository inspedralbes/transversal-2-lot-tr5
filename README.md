# League of Trivia (Grup 5)

## Integrants

- Iker Bravo

- Carlos Gómez

- Yenifer Wu

## Descripció

League of Trivia és un quiz online responsive multijugador que poden desafiar reciprocament.
 
[Prototip del Penpot](https://design.penpot.app/#/view/60409f81-bb57-80cc-8001-aac8ab9dfe2f?page-id=60409f81-bb57-80cc-8001-aac8ab9dfe30&section=interactions&index=0&share-id=39eb6d3d-9932-80bd-8001-abd9cfdb9f5e)


[URL del trivial](http://trivial5.alumnes.inspedralbes.cat/)

[documentació API](https://app.swaggerhub.com/apis/cargomfue/Trivial5/0.1#/) 


## CRON
En aquest projecte hi ha una funcionalitat la qual crea una partida automaticament a la BBDD donada una hora (a les 00:05). Hi haureu de crear el vostre propi cron perque funcioni.  
Per això heu de enganxar aquesta comanda:  
    - cd /home/a21cargomfue/web/trivial5.alumnes.inspedralbes.cat/public_html/transversal-2-lot-tr5/web/trivial5 && php artisan schedule:run >> /dev/null 2>&1  

Y també haureu de posar que s'executi cada minut


## Manual de desplegament
Els requeriments minims per poder utilitzar aquesta aplicació web i que tot funcioni bé són:
- Dispositiu des del qual es pugui obrir un navegador
- Connexió a internet
- Tenir la tasca del CRON, anterirment comentada, feta