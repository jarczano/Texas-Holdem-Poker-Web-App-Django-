from django.shortcuts import render

# Create your views here.


def index(request):
    return render(request, 'index.html')


def start(request):
    return render(request, 'start.html')


def menu(request):
    return render(request, 'menu.html')


def play(request, selected_opponent):
    context = {'selected_opponent': selected_opponent, }
    return render(request, 'game.html', context)
