<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Modules\Recruitment\Models\CscAction;

class CscActionTakenNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $action;

    /**
     * Create a new notification instance.
     */
    public function __construct(CscAction $action)
    {
        $this->action = $action;
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
        $status = $this->action->action_taken;
        return (new MailMessage)
                    ->subject('CSC Appointment Update: ' . $status)
                    ->greeting('Hello ' . $notifiable->first_name . ',')
                    ->line('The Civil Service Commission has taken action on your appointment.')
                    ->line('Status: ' . $status)
                    ->line('Remarks: ' . ($this->action->remarks ?? 'None'))
                    ->action('View Dashboard', url('/'))
                    ->line('Congratulations and thank you!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'type' => 'CscAction',
            'action_id' => $this->action->id,
            'status' => $this->action->action_taken,
            'message' => 'Your appointment was ' . strtolower($this->action->action_taken) . ' by the CSC.',
        ];
    }
}
