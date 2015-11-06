#include "player.h"
#include <qmath.h>
#include <math.h>

#include "game.h"

Player::Player()
{
}

void Player::setPosition(float x, float y, float z)
{
    this->x = x;
    this->y = y;
    this->z = z;
}

void Player::update()
{
    float radian = this->dirX * M_PI/180;
    this->velX = qCos(radian) * this->speed;
    this->velZ = qSin(radian) * this->speed;

    this->velY += this->gravity;
    if(this->velY > this->maxGravity){
        this->velY = this->maxGravity;
    }

    Game *g = Game::getInstance();
    QVector<Bloc> *blocs = g->map->blocs;
    for(int i = 0; i < blocs->size(); i++){
       if(this->hasCollision(blocs->at(i))){

       }
    }

    this->x += this->velX;
    this->y += this->velY;
    this->z += this->velZ;
}

bool Player::hasCollision(Bloc b)
{
    return this->x <= b.x + b.width
            && this->x + this->width >= b.x
            && this->y <= b.y + b.height
            && this->y + this->height >= b.y
            && this->z <= b.z + b.depth
            && this->z + this->depth >= b.z;
}

QMap *Player::getDeltaToMove(Bloc b)
{

}
