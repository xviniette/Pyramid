#include "player.h"

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
