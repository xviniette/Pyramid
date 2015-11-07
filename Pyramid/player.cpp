#include "player.h"
#include <qmath.h>
#include <math.h>

#include <QDebug>

#include "game.h"

Player::Player()
{
    this->x = 0;
    this->y = 0;
    this->z = 0;
    this->width = 20;
    this->depth = 20;
    this->height = 40;
    this->gravity = 0.5;
    this->jump = 5;
    this->maxGravity = 2;
    this->speed = 10;
    this->velX = this->velY = this->velZ = 0;
    this->dirX = 45;
    this->dirY = 0;
}

void Player::setPosition(float x, float y, float z)
{
    this->x = x;
    this->y = y;
    this->z = z;
}

void Player::update()
{
    float degGlobal = 0;
    int nbappuye = 0;
    this->velX = 0;
    this->velZ = 0;

    if(this->inputs.contains("u") && this->inputs["u"] == true){
        degGlobal += 0;
        nbappuye++;
    }
    if(this->inputs.contains("l") && this->inputs["l"] == true){
        degGlobal -= 90;
        nbappuye++;
    }
    if(this->inputs.contains("r") && this->inputs["r"] == true){
        degGlobal += 90;
        nbappuye++;
    }
    if(this->inputs.contains("d") && this->inputs["d"] == true){
        degGlobal -= 180;
        nbappuye++;
    }

    if(nbappuye > 0){
        degGlobal = degGlobal / nbappuye;
        float radian = (this->dirX + degGlobal) * M_PI/180;
        this->velX = qCos(radian) * this->speed;
        this->velZ = qSin(radian) * this->speed;
    }


    this->velY += this->gravity;
    if(this->velY > this->maxGravity){
        this->velY = this->maxGravity;
    }

    Game *g = Game::getInstance();
    QVector<Bloc> *blocs = g->map->blocs;
    for(int i = 0; i < blocs->size(); i++){
       if(this->hasCollision(blocs->at(i))){
            qDebug("COllision");
       }
    }

    this->x += this->velX;
    this->y += this->velY;
    this->z += this->velZ;

    qDebug()<<this->x << "/" << this->y << "/" << this->z;
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
/*<QString, float>
QMap<QString, float> *Player::getDeltaToMove(Bloc b)
{
    return new QMap();
}*/
