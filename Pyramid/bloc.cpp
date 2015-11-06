#include "bloc.h"

Bloc::Bloc()
{
}

Bloc::Bloc(float x, float y, float z, float width, float height, float depth)
{
    this->x = x;
    this->y = y;
    this->z = z;
    this->width = width;
    this->height = height;
    this->depth = depth;
}
