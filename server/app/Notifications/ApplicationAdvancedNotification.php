<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Modules\Recruitment\Models\Application;

class ApplicationAdvancedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $application;

    /**
     * Create a new notification instance.
     */
    public function __construct(Application $application)
    {
        $this->application = $application;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $status = $this->application->status;
        return (new MailMessage)
                    ->subject('Application Update: ' . $status)
                    ->greeting('Hello ' . $notifiable->first_name . ',')
                    ->line('Your application for the position of ' . $this->application->vacancy->plantillaItem->position_title . ' has advanced.')
                    ->line('New Status: ' . $status)
                    ->action('View Dashboard', url('/'))
                    ->line('Thank you for your patience during our recruitment process.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'ApplicationAdvanced',
            'application_id' => $this->application->id,
            'status' => $this->application->status,
            'message' => 'Your application has moved to: ' . $this->application->status,
        ];
    }
}
