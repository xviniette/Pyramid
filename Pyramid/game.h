#ifndef GAME_H
#define GAME_H

#include "player.h"
#include "bloc.h"
#include "map.h"

class Game
{
public:
    Game();
    void update();

private:
    Player *player;
    Map *map;

};

#endif // GAME_H
