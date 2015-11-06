#ifndef GAME_H
#define GAME_H

#include "player.h"
#include "bloc.h"
#include "map.h"
#include "game.h"

class Game
{
public:
    Game();
    static Game *getIntance();
    void update();
    static Game *instance;

private:
    Player *player;
    Map *map;

};

#endif // GAME_H
