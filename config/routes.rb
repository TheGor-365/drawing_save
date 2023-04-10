Rails.application.routes.draw do
  root "drawings#index"
  patch 'drawable/:id', to: 'drawings#drawable', as: 'drawable'
  resources :drawings
end
